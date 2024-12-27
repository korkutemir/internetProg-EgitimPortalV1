using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Data;

namespace BuildBackEnd.Repository.Repositories
{
    public class CategoryRepository : GenericRepository<Categories>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }
    }
}
