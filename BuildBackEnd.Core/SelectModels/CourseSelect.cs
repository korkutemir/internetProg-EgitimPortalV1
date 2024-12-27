using BuildBackEnd.Core.Models;

namespace BuildBackEnd.Core.SelectModels
{
    public class CourseSelect
    {
        public List<Courses> items { get; set; }
        public int total_count { get; set; }

    }
}
