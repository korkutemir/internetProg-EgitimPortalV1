using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Data;

namespace BuildBackEnd.Repository.Repositories
{
    public class CourseRepository : GenericRepository<Courses>, ICourseRepository
    {
        public CourseRepository(AppDbContext context) : base(context)
        {
        }
    }
}
