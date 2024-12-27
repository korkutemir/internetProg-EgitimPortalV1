using BuildBackEnd.Core.Models;
using Microsoft.AspNetCore.Identity;

namespace BuildBackEnd.Web.CustomValidations
{
    public class PasswordValidator : IPasswordValidator<Users>
    {
        public Task<IdentityResult> ValidateAsync(UserManager<Users> manager, Users user, string? password)
        {


            var errors = new List<IdentityError>();
            if (password!.ToLower().Contains(user.UserName!.ToLower()))
            {
                errors.Add(new() { Code = "PasswordContainUserName", Description = "Password field cannot contain username" });
            }

            if (password!.ToLower().StartsWith("1234"))
            {
                errors.Add(new() { Code = "PasswordContain1234", Description = "Password field cannot contain consecutive numbers" });
            }

            if (errors.Any())
            {
                return Task.FromResult(IdentityResult.Failed(errors.ToArray()));
            }

            return Task.FromResult(IdentityResult.Success);


        }
    }
}
