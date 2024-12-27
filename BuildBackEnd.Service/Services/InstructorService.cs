using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Core.SelectModels;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.TableModels;
using BuildBackEnd.Core.UnitOfWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Security.Claims;


namespace BuildBackEnd.Service.Services
{
    public class InstructorService : Service<Instructors>, IInstructorService
    {
        private readonly IInstructorRepository _InstructorRepository;
        private readonly IMapper _mapper;



        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemberService _memberService;

        public InstructorService(IGenericRepository<Instructors> repository, IUnitOfWork unitOfWork, IMapper mapper, IInstructorRepository main_repository, IHttpContextAccessor httpContextAccessor, IMemberService memberService)
            : base(repository, unitOfWork)
        {
            _mapper = mapper;
            _InstructorRepository = main_repository;
            _httpContextAccessor = httpContextAccessor;
            _memberService = memberService;
        }


        private int activeUserId => int.Parse(_httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private int activeUserRoleId => _memberService.GetRoleIdUser(activeUserId);
        private Users activeUser => _memberService.FindByUserId(activeUserId);


        public InstructorSelect InstructorSelect(string q, int page = 1, int pageSize = 10)
        {
            var filteredItems = _InstructorRepository.Where(x => x.Name.Contains(q ?? string.Empty, StringComparison.OrdinalIgnoreCase), false);

            var paginatedItems = filteredItems
                                  .Skip((page - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToList();

            return new InstructorSelect
            {
                items = paginatedItems,
                total_count = filteredItems.Count()
            };
        }
        public async Task<InstructorReturnModel> TableDataAsync(DataTableModel table)
        {
            var query = _InstructorRepository.GetAll(false).OrderByDescending(i => i.OrderNo).AsQueryable();

            // Arama
            if (!string.IsNullOrEmpty(table.search.value))
            {
                query = query.Where(i => i.Name.Contains(table.search.value) || i.CreatedDate.ToString().Contains(table.search.value));
            }

            int recordsTotal = await query.CountAsync();

            //Sıralama
            if (!string.IsNullOrEmpty(table.orderColumnName))
            {
                var ordering = table.orderDir.Equals("asc", StringComparison.OrdinalIgnoreCase) ? $"{table.orderColumnName} ascending" : $"{table.orderColumnName} descending";
                query = query.OrderBy(ordering);
            }


            var dataListTask = query.Skip(table.start).Take(table.lenght).ToListAsync();


            await Task.WhenAll(dataListTask);

            return (new InstructorReturnModel()
            {
                data = dataListTask.Result,
                draw = table.draw,
                recordsTotal = recordsTotal,
                recordsFiltered = recordsTotal
            });
        }


    }
}
