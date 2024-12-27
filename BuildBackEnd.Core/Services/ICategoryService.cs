using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.TableModels;

namespace BuildBackEnd.Core.Services
{
    public interface ICategoryService : IService<Categories>
    {


        Task<CategoryReturnModel> TableDataAsync(DataTableModel table);

    }
}
