using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.UnitOfWorks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace BuildBackEnd.Service.Services
{
    public class Service<T> : IService<T> where T : class
    {
        private readonly IGenericRepository<T> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public Service(IGenericRepository<T> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }


        public async Task<T> AddAsync(T entity)
        {
            await _repository.AddAsync(entity);
            await _unitOfWork.CommitAsync();
            return entity;
        }

        public async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
        {
            await _repository.AddRangeAsync(entities);
            await _unitOfWork.CommitAsync();
            return entities;
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> expression, bool tracking = true)
        {
            return await _repository.AnyAsync(expression, tracking);
        }

        public async Task<IEnumerable<T>> GetAllAsync(bool tracking = true)
        {
            return await _repository.GetAll(tracking).ToListAsync();
        }
        //public async Task<IEnumerable<T>> GetAllIncludesAsync(bool tracking = true, params Expression<Func<T, object>>[] includes)
        //{
        //    IQueryable<T> query = _repository.GetAllIncludes(tracking, includes);
        //    return await query.ToListAsync();
        //}

        public async Task<List<T>> GetAllIncludeThenIncludeAsync(bool tracking = true, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null)
        {
            List<T> query = await _repository.GetAllIncludeThenIncludeAsync(tracking, include);

            return query;
        }


        public async Task<T> GetByIdAsync(int id, bool tracking = true)
        {
            var hasProduct = await _repository.GetByIdAsync(id, tracking);

            if (hasProduct == null)
            {
                throw new KeyNotFoundException($"'{id}' not found.");
            }
            return hasProduct;
        }

        public int Count()
        {
            return _repository.Count();
        }

        //public async Task<T> GetByIdIncludeAsync(int id, bool tracking = true, params Expression<Func<T, object>>[] includes)
        //{
        //    var hasProduct = await _repository.GetByIdIncludeAsync(id, tracking, includes);

        //    if (hasProduct == null)
        //    {
        //        throw new KeyNotFoundException($"'{id}' not found.");
        //    }
        //    return hasProduct;
        //}
        public async Task<T> GetByIdIncludeThenIncludeAsync<TKey>(TKey id, bool tracking = true,
                  Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null)
        {
            IQueryable<T> query = _repository.GetAll(tracking);

            if (include != null)
            {
                query = include(query);
            }

            // Assuming your entities have a primary key named "Id". Adjust the lambda expression as needed.
            return await query.FirstOrDefaultAsync(e => EF.Property<TKey>(e, "Id").Equals(id));
        }



        public async Task RemoveAsync(T entity)
        {
            _repository.Remove(entity);
            await _unitOfWork.CommitAsync();
        }

        public async Task RemoveRangeAsync(IEnumerable<T> entities)
        {
            _repository.RemoveRange(entities);
            await _unitOfWork.CommitAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _repository.Update(entity);
            await _unitOfWork.CommitAsync();

        }

        public IQueryable<T> Where(Expression<Func<T, bool>> expression, bool tracking = true)
        {
            return _repository.Where(expression, tracking);
        }
    }
}
