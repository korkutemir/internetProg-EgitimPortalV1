using System.ComponentModel.DataAnnotations;

namespace BuildBackEnd.Core.viewModels.User
{
    public class UserVM
    {
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



        [Required(ErrorMessage = "The password field cannot be left blank!")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "The Password Repeat field cannot be left blank!")]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "The passwords don't match!")]
        public string ConfirmPassword { get; set; } = null!;


        //[Required(ErrorMessage = "Yetki Düzeyi Seçiniz!.")]
        //public int roleId { get; set; }

    }
}
