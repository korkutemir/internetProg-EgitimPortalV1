namespace BuildBackEnd.Core.Models.Bridges
{
    public class UserCourseBridge
    {
        public int UserId { get; set; }
        public Users User { get; set; }

        public int CourseId { get; set; }
        public Courses Course { get; set; }
    }
}
