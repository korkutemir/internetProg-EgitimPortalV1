using AutoMapper;
using BuildBackEnd.Core.Models.Bridges;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.UnitOfWorks;

namespace BuildBackEnd.Service.Services
{
    public class UserCourseBridgeService : Service<UserCourseBridge>, IUserCourseBridgeService
    {
        private readonly IUserCourseBridgeRepository _main_repository;
        private readonly IMapper _mapper;

        public UserCourseBridgeService(IGenericRepository<UserCourseBridge> repository, IUnitOfWork unitOfWork, IMapper mapper, IUserCourseBridgeRepository main_repository) : base(repository, unitOfWork)
        {
            _mapper = mapper;
            _main_repository = main_repository;
        }

    }
}
