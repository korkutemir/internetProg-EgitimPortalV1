using BuildBackEnd.Core.Models;

namespace BuildBackEnd.Core.TableModels
{
    public class CategoryReturnModel
    {
        public int draw { get; set; }
        public int recordsFiltered { get; set; }
        public int recordsTotal { get; set; }
        public List<Categories> data { get; set; }
    }
}
