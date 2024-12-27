using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.TableModels;
using BuildBackEnd.Core.UnitOfWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Security.Claims;


namespace BuildBackEnd.Service.Services
{
    public class CategoryService : Service<Categories>, ICategoryService
    {
        private readonly ICategoryRepository _CategoryRepository;
        private readonly IMapper _mapper;



        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemberService _memberService;


        public CategoryService(IGenericRepository<Categories> repository, IUnitOfWork unitOfWork, IMapper mapper, ICategoryRepository CategoryRepository, IHttpContextAccessor httpContextAccessor, IMemberService memberService)
            : base(repository, unitOfWork)
        {
            _mapper = mapper;
            _CategoryRepository = CategoryRepository;
            _httpContextAccessor = httpContextAccessor;
            _memberService = memberService;
        }


        private int activeUserId => int.Parse(_httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private int activeUserRoleId => _memberService.GetRoleIdUser(activeUserId);
        private Users activeUser => _memberService.FindByUserId(activeUserId);



        public async Task<CategoryReturnModel> TableDataAsync(DataTableModel table)
        {
            var query = _CategoryRepository.GetAll(false)
                .OrderByDescending(i => i.CreatedDate).AsQueryable();



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

            return (new CategoryReturnModel()
            {
                data = dataListTask.Result,
                draw = table.draw,
                recordsTotal = recordsTotal,
                recordsFiltered = recordsTotal
            });
        }




    }
}
