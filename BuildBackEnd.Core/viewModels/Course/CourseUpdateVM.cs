namespace BuildBackEnd.Core.viewModels
{
    public class CourseUpdateVM : BaseEntityVM
    {
        public string Description { get; set; }

        public string Name { get; set; }
        public int CategoryId { get; set; }
        public int InstructorId { get; set; }


        public int? OrderNo { get; set; }

    }
}
