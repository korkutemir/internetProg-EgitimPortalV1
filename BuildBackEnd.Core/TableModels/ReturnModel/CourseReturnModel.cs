using BuildBackEnd.Core.Models;

namespace BuildBackEnd.Core.TableModels
{
    public class CourseReturnModel
    {
        public int draw { get; set; }
        public int recordsFiltered { get; set; }
        public int recordsTotal { get; set; }
        public List<Courses> data { get; set; }
    }
}
