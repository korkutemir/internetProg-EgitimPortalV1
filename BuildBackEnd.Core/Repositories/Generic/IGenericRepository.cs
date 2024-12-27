using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace BuildBackEnd.Core.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id, bool tracking = true);
        //Task<T> GetByIdIncludeAsync(int id, bool tracking = true, params Expression<Func<T, object>>[] includes);
        Task<T> GetByIdIncludeThenIncludeAsync<TKey>(TKey id, bool tracking = true, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null);
        IQueryable<T> GetAll(bool tracking = true);
        Task<List<T>> GetAllIncludeThenIncludeAsync(bool tracking = true, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null);
        //IQueryable<T> GetAllIncludes(bool tracking = true, params Expression<Func<T, object>>[] includes);
        IQueryable<T> Where(Expression<Func<T, bool>> expression, bool tracking = true);
        Task<bool> AnyAsync(Expression<Func<T, bool>> expression, bool tracking = true);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        void Update(T entity);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
        public int Count();
    }
}
