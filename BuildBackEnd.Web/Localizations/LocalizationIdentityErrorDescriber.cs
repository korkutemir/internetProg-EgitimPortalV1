using Microsoft.AspNetCore.Identity;

namespace BuildBackEnd.Web.Localizations
{
    public class LocalizationIdentityErrorDescriber : IdentityErrorDescriber
    {

        public override IdentityError DuplicateEmail(string email)
        {
            return new() { Code = nameof(DuplicateEmail), Description = $"This Email Address is '{email}' Already in Use" };
        }

        public override IdentityError DuplicateUserName(string userName)
        {
            return new() { Code = nameof(DuplicateUserName), Description = $"This User Name is '{userName}' Already in Use." };
        }

        public override IdentityError PasswordMismatch()
        {
            return new() { Code = nameof(PasswordMismatch), Description = "The codes don't match!" };
        }

        public override IdentityError InvalidEmail(string email)
        {
            return new() { Code = nameof(InvalidEmail), Description = $"This Email Address is '{email}' Invalid." };
        }

        public override IdentityError InvalidUserName(string userName)
        {
            return new() { Code = nameof(InvalidUserName), Description = $"This Username ({userName}) is Invalid!" };
        }

        public override IdentityError PasswordTooShort(int length)
        {
            return new() { Code = nameof(PasswordTooShort), Description = $"Password At Least {length} Character Must Be!" };
        }



    }
}
