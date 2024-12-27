using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.viewModels;
using BuildBackEnd.Web.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuildBackEnd.Web.Controllers
{

    [Authorize(Roles = "Admin, Course Admin")]
    public class CourseController : Controller
    {
        private readonly ICourseService _CourseService;
        private readonly IMediaService _mediaService;
        private readonly IUserCourseBridgeService _userCourseBridgeService;

        private readonly IHttpContextAccessor _httpContextAccessor;


        private readonly IResponseService _responseService;
        private readonly IMapper _mapper;
        private readonly IHubContext<CourseHub> _hubContext;

        public CourseController(ICourseService CourseService, IMediaService mediaService, IResponseService responseService, IMapper mapper, IUserCourseBridgeService userCourseBridgeService, IHttpContextAccessor httpContextAccessor, IHubContext<CourseHub> hubContext)
        {
            _CourseService = CourseService;
            _mediaService = mediaService;
            _responseService = responseService;
            _mapper = mapper;
            _userCourseBridgeService = userCourseBridgeService;
            _httpContextAccessor = httpContextAccessor;
            _hubContext = hubContext;
        }
        private int activeUserId => int.Parse(_httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);


        public IActionResult Index()
        {
            return View();
        }

        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> GetCourseJson(int CourseId)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            var response = await _CourseService.GetByIdAsync(CourseId);

            return Json(response);
        }


        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> GetCourses()
        {
            try
            {
                var response = await _CourseService.GetAllIncludeThenIncludeAsync(include: i => i.Include(i => i.Category).Include(i => i.Instructor));

                return Json(response);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
                //throw;
            }

        }


        [ValidateAntiForgeryToken]
        public async Task<JsonResult> CreateJson(CourseVM Course)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            var response = await _CourseService.AddAsync(_mapper.Map<Courses>(Course));

            TempData["CourseMessage"] = "Added successfully!";
            return Json(_responseService.HandleSuccessData("Added successfully!", response.Id));
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> UpdateJson(CourseUpdateVM CourseUpdate)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            await _CourseService.UpdateAsync(_mapper.Map<Courses>(CourseUpdate));


            TempData["CourseMessage"] = "Updated successfully!";
            return Json(_responseService.HandleSuccessData("Updated successfully!", CourseUpdate.Id));
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> RemoveJson(int id)
        {
            var data = await _CourseService.GetByIdAsync(id);


            await _CourseService.RemoveAsync(data);

            return Json(_responseService.HandleSuccess("Successfully Deleted!"));
        }

        //[HttpPost]
        //public async Task<JsonResult> RegisterStudent(int courseId, string studentName)
        //{
        //    // Logic to register the student to the course
        //    // ...

        //    // Notify all clients about the new registration
        //    await _hubContext.Clients.All.SendAsync("ReceiveStudentRegistration", studentName, "Course Name");

        //    return Json(new { success = true });
        //}

    }
}