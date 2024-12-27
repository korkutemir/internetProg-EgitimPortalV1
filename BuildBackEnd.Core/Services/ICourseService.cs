using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.SelectModels;
using BuildBackEnd.Core.TableModels;

namespace BuildBackEnd.Core.Services
{
    public interface ICourseService : IService<Courses>
    {
        Task<CourseReturnModel> TableDataAsync(DataTableModel table, string from, string fromtodate, int CategoryId);
        CourseSelect CourseSelect(string q, int page = 1, int pageSize = 10);
    }
}
