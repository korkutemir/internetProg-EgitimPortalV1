using BuildBackEnd.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.Web.Controllers
{


    [Authorize(Roles = "Admin,Category Admin")]
    public class PanelController : Controller
    {


        private readonly ICategoryService _CategoryService;

        public PanelController(ICategoryService CategoryService)
        {
            _CategoryService = CategoryService;
        }

        public IActionResult Index()
        {
            ViewBag.CategoryCount = _CategoryService.Count();

            return View();
        }

        public IActionResult RealTimeRegistrations()
        {
            return View();
        }
    }
}
