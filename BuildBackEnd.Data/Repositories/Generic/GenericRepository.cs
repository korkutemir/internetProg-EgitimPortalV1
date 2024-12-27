using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace BuildBackEnd.Repository.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> expression, bool tracking = true)
        {
            IQueryable<T> query = tracking ? _dbSet : _dbSet.AsNoTracking();
            return await query.AnyAsync(expression);
        }

        public IQueryable<T> GetAll(bool tracking = true)
        {
            return tracking ? _dbSet : _dbSet.AsNoTracking();
        }

        //public IQueryable<T> GetAllIncludes(bool tracking = true, params Expression<Func<T, object>>[] includes)
        //{
        //    IQueryable<T> query = _dbSet;

        //    // Include parametrelerini sorguya ekleyin
        //    foreach (var include in includes)
        //    {
        //        query = query.Include(include);
        //    }

        //    // Tracking seçeneği
        //    if (!tracking)
        //    {
        //        query = query.AsNoTracking();
        //    }

        //    return query;
        //}




        public async Task<List<T>> GetAllIncludeThenIncludeAsync(bool tracking = true, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null)
        {
            IQueryable<T> query = _dbSet;

            if (!tracking)
            {
                query = query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }

            return await query.ToListAsync();
        }



        public async Task<T> GetByIdAsync(int id, bool tracking = true)
        {
            if (tracking)
            {
                return await _dbSet.FindAsync(id);
            }
            else
            {
                return await _dbSet.AsNoTracking().FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
            }

        }


        public async Task<T> GetByIdIncludeAsync(int id, bool tracking = true, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;

            if (!tracking)
            {
                query = query.AsNoTracking();
            }

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
        }

        public async Task<T> GetByIdIncludeThenIncludeAsync<TKey>(TKey id, bool tracking = true, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null)
        {
            IQueryable<T> query = _dbSet;

            if (!tracking)
            {
                query = query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }
            return await query.FirstOrDefaultAsync(e => EF.Property<TKey>(e, "Id").Equals(id));
        }




        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public int Count()
        {
            return _dbSet.Count();
        }

        public IQueryable<T> Where(Expression<Func<T, bool>> expression, bool tracking = true)
        {
            return tracking ? _dbSet.Where(expression) : _dbSet.AsNoTracking().Where(expression);
        }

    }
}
