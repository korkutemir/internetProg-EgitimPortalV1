using BuildBackEnd.Core.Models;

namespace BuildBackEnd.Core.SelectModels
{
    public class UserSelect
    {
        public List<Users> items { get; set; }
        public int total_count { get; set; }

    }
}
