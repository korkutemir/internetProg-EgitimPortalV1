using BuildBackEnd.Core.Models.Bridges;
using Microsoft.AspNetCore.Identity;

namespace BuildBackEnd.Core.Models
{
    public class Users : IdentityUser<int>
    {
        public string Name { get; set; }
        public string Surname { get; set; }


        // Kullanıcıların ilişkili olduğu kursları ve UserCourseBridge üzerinden bağlantıyı belirtiyoruz
        public List<UserCourseBridge> UserCourseBridge { get; set; }

    }
}
