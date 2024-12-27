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
    public class CourseService : Service<Courses>, ICourseService
    {
        private readonly ICourseRepository _Course_repository;
        private readonly IMapper _mapper;

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemberService _memberService;


        public CourseService(IGenericRepository<Courses> repository, IUnitOfWork unitOfWork, IMapper mapper, ICourseRepository main_repository, IHttpContextAccessor httpContextAccessor, IMemberService memberService)
            : base(repository, unitOfWork)
        {
            _mapper = mapper;
            _Course_repository = main_repository;
            _httpContextAccessor = httpContextAccessor;
            _memberService = memberService;
        }


        private int activeUserId => int.Parse(_httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private int activeUserRoleId => _memberService.GetRoleIdUser(activeUserId);
        private Users activeUser => _memberService.FindByUserId(activeUserId);




        public CourseSelect CourseSelect(string q, int page = 1, int pageSize = 10)
        {
            // Query ile başla ve boş ise boş string ile değiştir
            var filteredItems = _Course_repository.Where(x => x.Name.Contains(q ?? string.Empty, StringComparison.OrdinalIgnoreCase));



            // Önce toplam eleman sayısını al
            int totalCount = filteredItems.Count();

            // Sayfalama yap
            var paginatedItems = filteredItems
                                 .Skip((page - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToList();

            // Sonuçları dön
            return new CourseSelect
            {
                items = paginatedItems,
                total_count = totalCount
            };
        }

        public async Task<CourseReturnModel> TableDataAsync(DataTableModel table, string from, string fromtodate, int CategoryId)
        {
            var query = _Course_repository.GetAll(false)
                .Include(i => i.Category)
                .OrderByDescending(i => i.OrderNo).AsQueryable();


            if (CategoryId != 0)
            {
                query = query.Where(i => i.CategoryId == CategoryId);
            }

            if (!string.IsNullOrEmpty(from) && !string.IsNullOrEmpty(fromtodate))
            {
                DateTime to;
                DateTime toDate;
                if (DateTime.TryParse(fromtodate, out toDate) && DateTime.TryParse(from, out to))
                {
                    query = query.Where(i => i.CreatedDate >= to && i.CreatedDate <= toDate);
                }
            }

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

            return (new CourseReturnModel()
            {
                data = dataListTask.Result,
                draw = table.draw,
                recordsTotal = recordsTotal,
                recordsFiltered = recordsTotal
            });
        }

    }
}
