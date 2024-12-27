using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Data;

namespace BuildBackEnd.Repository.Repositories
{
    public class InstructorRepository : GenericRepository<Instructors>, IInstructorRepository
    {
        public InstructorRepository(AppDbContext context) : base(context)
        {
        }
    }
}
