using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Models.Bridges;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.viewModels;
using BuildBackEnd.Web.Extenisons;
using BuildBackEnd.Web.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuildBackEnd.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICourseService _courseService;
        private readonly IUserCourseBridgeService _userCourseBridgeService;
        private readonly IHubContext<CourseHub> _hubContext;

        private readonly SignInManager<Users> _signInManager;
        private UserManager<Users> _userManager;
        private RoleManager<UserRole> _roleManager;
        private IResponseService _responseService;
        private IMemberService _memberService;

        public HomeController(ICourseService courseService, SignInManager<Users> signInManager, UserManager<Users> userManager, RoleManager<UserRole> roleManager, IResponseService responseService, IMemberService memberService, IUserCourseBridgeService userCourseBridgeService, IHubContext<CourseHub> hubContext)
        {
            _courseService = courseService;
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _responseService = responseService;
            _memberService = memberService;
            _userCourseBridgeService = userCourseBridgeService;
            _hubContext = hubContext;
        }

        private string userName => User.Identity!.Name!;
        private int userId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);



        public async Task<IActionResult> Index()
        {
            var data = await _courseService.GetAllIncludeThenIncludeAsync(false, include: i => i.Include(i => i.Instructor).Include(i => i.Category).Include(i => i.UserCourseBridge));
            return View(data);
        }

        [Authorize]
        public async Task<IActionResult> Kurslarim()
        {
            var data = await _courseService.Where(i => i.UserCourseBridge.Any(i => i.UserId == userId)).ToListAsync();
            return View(data);
        }

        public async Task<JsonResult> UserRegisterToCourse(int courseId)
        {
            var data = await _courseService.Where(i => i.Id == courseId).FirstOrDefaultAsync();
            var user = await _userManager.FindByIdAsync(userId.ToString());
            UserCourseBridge userCourseBridge = new UserCourseBridge();
            userCourseBridge.CourseId = courseId;
            userCourseBridge.UserId = userId;
            await _userCourseBridgeService.AddAsync(userCourseBridge);

            await _hubContext.Clients.All.SendAsync("ReceiveStudentRegistration", user.UserName, data.Name);


            return Json(_responseService.HandleSuccess("Kayıt olundu"));
        }


        //Sisteme Giriş | Method
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> SignIn(SignInViewModel model, string? returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { eventAjax = "Errors", errors = ModelState });
            }
            returnUrl ??= "/Panel/";


            var hasUser = await _memberService.FindByEmailAsync(model.Email);

            if (hasUser == null)
            {
                return Json(_responseService.HandleError("Email or password is incorrect."));

            }





            var signInResult = await _signInManager.PasswordSignInAsync(hasUser, model.Password, model.RememberMe, true);


            if (signInResult.IsLockedOut)
            {
                ModelState.AddModelErrorList(new List<string>() { "You cannot log in for 3 minutes." });
                return Json(new { eventAjax = "TimeErrors", errors = ModelState });

            }

            if (!signInResult.Succeeded)
            {
                ModelState.AddModelErrorList(new List<string>() { $"Email or password is incorrect", $"Number of failed logins = {await _memberService.GetAccessFailedCountAsync(hasUser)}" });
                return Json(_responseService.HandleError("Email or password is incorrect."));

            }

            return Json(_responseService.HandleSuccessData("Login successful", returnUrl));
        }
        public async Task<IActionResult> Login()
        {
            return View();
        }


        //Çıkış Yap | Method
        public async Task<IActionResult> Logout()
        {
            await _memberService.LogoutAsync();
            return RedirectToAction("Login", "Home");
        }


    }
}
