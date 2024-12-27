using System.ComponentModel.DataAnnotations;

namespace BuildBackEnd.Web.Models
{
    public class UserModelUpdate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public int Role { get; set; }

        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [DataType(DataType.Password)]
        public string? CurrentPassword { get; set; }


        [DataType(DataType.Password)]
        public string? ConfirmPassword { get; set; } = null!;

    }
}
