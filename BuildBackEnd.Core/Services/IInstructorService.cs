using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.SelectModels;
using BuildBackEnd.Core.TableModels;

namespace BuildBackEnd.Core.Services
{
    public interface IInstructorService : IService<Instructors>
    {
        Task<InstructorReturnModel> TableDataAsync(DataTableModel table);
        InstructorSelect InstructorSelect(string q, int page = 1, int pageSize = 10);
    }
}
