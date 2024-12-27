using System.ComponentModel.DataAnnotations;

namespace BuildBackEnd.Core.viewModels.User
{
    public class UserUpdateVM
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "The Name  field cannot be left blank!")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The Surname  field cannot be left blank!")]
        public string Surname { get; set; }

        [Required(ErrorMessage = "The User Name field cannot be left blank!")]
        public string UserName { get; set; }

        [EmailAddress(ErrorMessage = "The email format is incorrect!")]
        [Required(ErrorMessage = "The Email field cannot be left blank!")]
        public string Email { get; set; }

        [Required(ErrorMessage = "The phone field cannot be left blank!")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "You Cannot Leave User Authorization Empty!")]
        public int Role { get; set; }

        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [DataType(DataType.Password)]
        public string? CurrentPassword { get; set; }


        [DataType(DataType.Password)]
        public string? ConfirmPassword { get; set; } = null!;

        public int[]? CategoryIds { get; set; }
    }
}
