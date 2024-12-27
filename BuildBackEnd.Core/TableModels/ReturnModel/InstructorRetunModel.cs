using BuildBackEnd.Core.Models;

namespace BuildBackEnd.Core.TableModels
{
    public class InstructorReturnModel
    {
        public int draw { get; set; }
        public int recordsFiltered { get; set; }
        public int recordsTotal { get; set; }
        public List<Instructors> data { get; set; }
    }
}
