using BuildBackEnd.Core.Models.Bridges;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Data;

namespace BuildBackEnd.Repository.Repositories
{
    public class UserCouseBridgeRepository : GenericRepository<UserCourseBridge>, IUserCourseBridgeRepository
    {
        public UserCouseBridgeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
