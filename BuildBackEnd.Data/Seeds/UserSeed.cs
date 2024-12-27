

using BuildBackEnd.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BackEndAspNetCore.Data.Seeds
{
    public class UserSeed : IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {

            var Admin = new Users
            {
                Name = "John",
                Surname = "Doe",
                Email = "admin@admin.com",
                NormalizedEmail = "ADMIN@ADMIN.COM",
                NormalizedUserName = "JOHNDOE",
                UserName = "johndoe",
                PasswordHash = "AQAAAAIAAYagAAAAEJxR+I7etHHVFTsUXI3aoK0KXg9FOEls+ljzSIUoFOGRHjmBGhqc9z5NP+hZGBqWOQ==",
                SecurityStamp = "NACN6XFIRLFG5Z3RDJXT7MWOQSH4SB3T",
                Id = 1
            };
            //EmirKorkut07




            //seed user
            builder.HasData(Admin);




        }
    }
}
