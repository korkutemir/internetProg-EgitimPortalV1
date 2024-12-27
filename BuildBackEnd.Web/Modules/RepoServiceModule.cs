using Autofac;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.UnitOfWorks;
using BuildBackEnd.Data;
using BuildBackEnd.Repository.Repositories;
using BuildBackEnd.Repository.UnitOfWorks;
using BuildBackEnd.Service.Mapping;
using BuildBackEnd.Service.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Reflection;
using Module = Autofac.Module;

namespace BuildBackEnd.Web.Modules
{
    public class RepoServiceModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<AppDbContext>().AsSelf().InstancePerLifetimeScope();

            builder.RegisterType<UserStore<Users, UserRole, AppDbContext, int>>().As<IUserStore<Users>>().InstancePerLifetimeScope();

            builder.RegisterType<UserManager<Users>>()
                   .AsSelf()
                   .InstancePerLifetimeScope();

            builder.RegisterType<SignInManager<Users>>()
                   .AsSelf()
                   .InstancePerLifetimeScope();

            builder.RegisterGeneric(typeof(GenericRepository<>)).As(typeof(IGenericRepository<>)).InstancePerLifetimeScope();
            builder.RegisterGeneric(typeof(Service<>)).As(typeof(IService<>)).InstancePerLifetimeScope();
            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>();



            var apiAssembly = Assembly.GetExecutingAssembly();
            var repoAssembly = Assembly.GetAssembly(typeof(AppDbContext));
            var serviceAssembly = Assembly.GetAssembly(typeof(MapProfile));

            builder.RegisterAssemblyTypes(apiAssembly, repoAssembly, serviceAssembly).Where(x => x.Name.EndsWith("Repository")).AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterAssemblyTypes(apiAssembly, repoAssembly, serviceAssembly).Where(x => x.Name.EndsWith("Service")).AsImplementedInterfaces().InstancePerLifetimeScope();
            //builder.RegisterType<ProductService>().As<IProductService>().InstancePerLifetimeScope();





        }
    }
}
