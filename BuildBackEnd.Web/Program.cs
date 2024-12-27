using Autofac;
using Autofac.Extensions.DependencyInjection;
using BuildBackEnd.Core.Middleware;
using BuildBackEnd.Data;
using BuildBackEnd.Service.Mapping;
using BuildBackEnd.Web.Extenisons;
using BuildBackEnd.Web.Hubs;
using BuildBackEnd.Web.Modules;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// JSON dngsel referanslarnnlemek ve JSON ktsn dzenlemek iin.
builder.Services.AddControllersWithViews().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    opt.JsonSerializerOptions.WriteIndented = false;
});
builder.Services.AddAutoMapper(typeof(MapProfile));

// Veritabanbalants ve DbContext ayarları.
//string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
//builder.Services.AddDbContext<AppDbContext>(options =>
//{
//    var migrationsAssembly = typeof(AppDbContext).Assembly.GetName().Name;
//    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), b => b.MigrationsAssembly(migrationsAssembly).EnableStringComparisonTranslations());
//});

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
}, ServiceLifetime.Transient);

// Identity yaplandrmas ve parola politikaları.
builder.Services.AddIdentityWithExt();

// Autofac ile bağmlılk enjeksiyonu.
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder => containerBuilder.RegisterModule(new RepoServiceModule()));

// Uygulama erez yaplandrması.
builder.Services.ConfigureApplicationCookie(opt =>
{
    opt.Cookie.Name = "AppCookie";
    opt.LoginPath = new PathString("/Member/Login");
    opt.LogoutPath = new PathString("/Member/Logout");
    opt.AccessDeniedPath = new PathString("/Panel/");
    opt.Cookie.HttpOnly = true;
    opt.ExpireTimeSpan = TimeSpan.FromDays(60);
    opt.SlidingExpiration = true;
});

// Yetkilendirme politikaları.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AuthPolicy", policy =>
    {
        policy.RequireAuthenticatedUser();
    });
});

// CORS politikaları.
builder.Services.AddCors(policy =>
{
    policy.AddPolicy("AllowedHosts", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Antiforgery token yaplandrması.
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-Token";
});

// HttpContext erişimi.
builder.Services.AddHttpContextAccessor();

// Uygulamayı oluşturma ve middleware yaplandrmaları.
builder.Services.AddSignalR();

var app = builder.Build();
app.UseCors("AllowedHosts");

app.UseHsts();

// zel durum ynetimi.
app.UseMiddleware<ErrorHandlingMiddleware>();

// HTTPS ynlendirmesi.
app.UseHttpsRedirection();
app.UseStaticFiles();

// Routing.
app.UseRouting();

// Kimlik doğrulama ve yetkilendirme.
app.UseAuthentication();
app.UseAuthorization();

// Controller rotaları.
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<CourseHub>("/courseHub");
    endpoints.MapControllers();
});

// Uygulamayı başlat.
app.Run();
