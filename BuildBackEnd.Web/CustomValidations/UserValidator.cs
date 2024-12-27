using BuildBackEnd.Core.Models;
using Microsoft.AspNetCore.Identity;

namespace BuildBackEnd.Web.CustomValidations
{
    public class UserValidator : IUserValidator<Users>
    {
        public Task<IdentityResult> ValidateAsync(UserManager<Users> manager, Users user)
        {
            var errors = new List<IdentityError>();
            var isDigit = int.TryParse(user.UserName![0].ToString(), out _);

            if (isDigit)
            {
                errors.Add(new() { Code = "UserNameContainFirstLetterDigit", Description = "The first character of the username cannot contain a numeric character" });
            }

            if (errors.Any())
            {
                return Task.FromResult(IdentityResult.Failed(errors.ToArray()));
            }

            return Task.FromResult(IdentityResult.Success);
        }
    }
}
