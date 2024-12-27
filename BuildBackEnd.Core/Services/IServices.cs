using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace BuildBackEnd.Core.Services
{
    public interface IService<T> where T : class
    {
        Task<T> GetByIdAsync(int id, bool tracking = true);
        //Task<T> GetByIdIncludeAsync(int id, bool tracking = true, params Expression<Func<T, object>>[] includes);
        Task<T> GetByIdIncludeThenIncludeAsync<TKey>(TKey id, bool tracking = true,
                  Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null);
        Task<IEnumerable<T>> GetAllAsync(bool tracking = true);
        Task<List<T>> GetAllIncludeThenIncludeAsync(bool tracking = true, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null);
        //Task<IEnumerable<T>> GetAllIncludesAsync(bool tracking = true, params Expression<Func<T, object>>[] includes);
        IQueryable<T> Where(Expression<Func<T, bool>> expression, bool tracking = true);
        Task<bool> AnyAsync(Expression<Func<T, bool>> expression, bool tracking = true);
        Task<T> AddAsync(T entity);
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task RemoveAsync(T entity);
        Task RemoveRangeAsync(IEnumerable<T> entities);
        int Count();
    }
}
