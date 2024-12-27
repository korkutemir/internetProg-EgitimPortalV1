
using BuildBackEnd.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BackEndAspNetCore.Data.Seeds
{
    public class UserRoleSeed : IEntityTypeConfiguration<UserRole>
    {
        public void Configure(EntityTypeBuilder<UserRole> builder)
        {


            builder.HasData(
    new UserRole { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
    new UserRole { Id = 2, Name = "User", NormalizedName = "User" }

);



        }
    }
}
