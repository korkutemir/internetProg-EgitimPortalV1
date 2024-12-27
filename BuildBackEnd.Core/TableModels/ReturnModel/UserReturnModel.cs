using BuildBackEnd.Core.Models;

namespace BuildBackEnd.Core.TableModels
{
    public class UserReturnModel
    {
        public int draw { get; set; }
        public int recordsFiltered { get; set; }
        public int recordsTotal { get; set; }
        public List<Users> data { get; set; }
    }
}
