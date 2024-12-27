using Autofac;
using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Repositories;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.Translation;
using BuildBackEnd.Core.UnitOfWorks;
using BuildBackEnd.Data;
using BuildBackEnd.Repository.Repositories;
using BuildBackEnd.Repository.UnitOfWorks;
using BuildBackEnd.Service.Mapping;
using BuildBackEnd.Service.Services;
using BuildBackEnd.Service.Services.Localization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Reflection;
using Module = Autofac.Module;

namespace BuildBackEnd.WebApi.Modules
{
    public class RepoServiceModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<AppDbContext>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<UserStore<Users, UserRole, AppDbContext, int>>().As<IUserStore<Users>>().InstancePerLifetimeScope();
            builder.RegisterType<UserManager<Users>>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<SignInManager<Users>>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterGeneric(typeof(GenericRepository<>)).As(typeof(IGenericRepository<>)).InstancePerLifetimeScope();
            builder.RegisterGeneric(typeof(Service<>)).As(typeof(IService<>)).InstancePerLifetimeScope();
            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>();

            var apiAssembly = Assembly.GetExecutingAssembly();
            var repoAssembly = Assembly.GetAssembly(typeof(AppDbContext));
            var serviceAssembly = Assembly.GetAssembly(typeof(MapProfile));

            builder.RegisterAssemblyTypes(apiAssembly, repoAssembly, serviceAssembly)
                   .Where(x => x.Name.EndsWith("Repository"))
                   .AsImplementedInterfaces()
                   .InstancePerLifetimeScope();

            builder.RegisterAssemblyTypes(apiAssembly, repoAssembly, serviceAssembly)
                   .Where(x => x.Name.EndsWith("Service"))
                   .AsImplementedInterfaces()
                   .InstancePerLifetimeScope();

            // Configure AutoMapper
            builder.Register(context =>
            {
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddMaps(serviceAssembly);  // Assuming that AutoMapper profiles are in 'serviceAssembly'
                });

                return config.CreateMapper();
            }).As<IMapper>().SingleInstance(); // Register IMapper as a single instance

            builder.RegisterType<HttpClient>()
               .AsSelf()
               .SingleInstance();


            builder.RegisterType<LanguageService>().As<ILanguageService>();


            builder.Register(c =>
            {
                var env = c.Resolve<IWebHostEnvironment>();
                var basePath = Path.Combine(env.WebRootPath, "uploads", "translation", "categorytranslations");
                return new LocalizationService<CategoryTranslations, CategoryDetails>(basePath);
            }).As<LocalizationService<CategoryTranslations, CategoryDetails>>().SingleInstance();


            builder.Register(c =>
            {
                var env = c.Resolve<IWebHostEnvironment>();
                var basePath = Path.Combine(env.WebRootPath, "uploads", "translation", "doctortranslations");
                return new LocalizationService<DoctorTranslations, DoctorDetails>(basePath);
            }).As<LocalizationService<DoctorTranslations, DoctorDetails>>().SingleInstance();



            //builder.Register(c =>
            //{
            //    var env = c.Resolve<IWebHostEnvironment>();
            //    var basePath = Path.Combine(env.WebRootPath, "uploads", "translation", "categorytranslations");
            //    return new LocalizationService<CategoryTranslations, CategoryDetails>(basePath);
            //}).As<LocalizationService<CategoryTranslations, CategoryDetails>>().SingleInstance();




        }
    }
}
