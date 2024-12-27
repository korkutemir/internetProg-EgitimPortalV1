using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Models.Bridges;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BuildBackEnd.Data
{
    public class AppDbContext : IdentityDbContext<Users, UserRole, int>
    {
        public DbSet<Categories> Categories { get; set; }
        public DbSet<Instructors> Instructors { get; set; }
        public DbSet<Courses> Courses { get; set; }
        public DbSet<UserCourseBridge> UserCourseBridges { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public override int SaveChanges()
        {
            foreach (var item in ChangeTracker.Entries())
            {
                if (item.Entity is BaseEntity entityReference)
                {
                    switch (item.State)
                    {
                        case EntityState.Added:
                            {
                                entityReference.CreatedDate = DateTime.Now;
                                break;
                            }
                        case EntityState.Modified:
                            {
                                entityReference.EditingDate = DateTime.Now;
                                break;
                            }
                    }
                }
            }
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var item in ChangeTracker.Entries())
            {
                if (item.Entity is BaseEntity entityReference)
                {
                    switch (item.State)
                    {
                        case EntityState.Added:
                            {
                                entityReference.CreatedDate = DateTime.Now;
                                break;
                            }
                        case EntityState.Modified:
                            {
                                Entry(entityReference).Property(x => x.CreatedDate).IsModified = false;
                                entityReference.EditingDate = DateTime.Now;
                                break;
                            }
                    }
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<IdentityUserLogin<int>>().HasKey(x => new { x.ProviderKey, x.LoginProvider });
            builder.Entity<IdentityUserRole<int>>().HasKey(x => new { x.UserId, x.RoleId });
            builder.Entity<UserCourseBridge>().HasKey(ucb => new { ucb.UserId, ucb.CourseId });

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(builder);
        }
    }
}
