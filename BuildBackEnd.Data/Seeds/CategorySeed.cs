
using BuildBackEnd.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BackEndAspNetCore.Data.Seeds
{
    public class CategorySeed : IEntityTypeConfiguration<Categories>
    {
        public void Configure(EntityTypeBuilder<Categories> builder)
        {

            var data = new Categories
            {
                Name = "C#",
                Id = 1,
                CreatedDate = DateTime.Now,

            };

            var data2 = new Categories
            {
                Name = "Javascript",
                Id = 2,
                CreatedDate = DateTime.Now,
            };


            builder.HasData(data);
            builder.HasData(data2);
        }
    }
}
