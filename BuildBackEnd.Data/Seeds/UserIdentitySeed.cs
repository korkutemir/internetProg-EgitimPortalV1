
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BackEndAspNetCore.Data.Seeds
{
    public class UserIdentitySeed : IEntityTypeConfiguration<IdentityUserRole<int>>
    {
        public void Configure(EntityTypeBuilder<IdentityUserRole<int>> builder)
        {

            builder.HasData(
                new IdentityUserRole<int> { RoleId = 1, UserId = 1 }
            );

            builder.HasKey(x => new { x.UserId, x.RoleId });


        }
    }
}
