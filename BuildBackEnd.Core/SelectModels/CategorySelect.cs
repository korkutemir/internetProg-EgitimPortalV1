using BuildBackEnd.Core.Models;

namespace BuildBackEnd.Core.SelectModels
{
    public class CategorySelect
    {
        public List<Categories> items { get; set; }
        public int total_count { get; set; }

    }
}
