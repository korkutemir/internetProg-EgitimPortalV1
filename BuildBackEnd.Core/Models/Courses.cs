
    using BuildBackEnd.Core.Models.Bridges;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace BuildBackEnd.Core.Models
    {
        public class Courses : BaseEntity
        {
            public string Name { get; set; }

            //[Column(TypeName = "LONGTEXT")]
            public string Description { get; set; }

            public int CategoryId { get; set; }
            public Categories Category { get; set; }



            public int InstructorId { get; set; }
            public Instructors Instructor { get; set; }


            public int OrderNo { get; set; }

        // Bir kursun kullanıcılarla ilişkisini yönetiyoruz
        public List<UserCourseBridge> UserCourseBridge { get; set; }





    }
    }
