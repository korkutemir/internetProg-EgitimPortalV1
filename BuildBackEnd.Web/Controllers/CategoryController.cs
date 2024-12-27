using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.viewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.Web.Controllers
{
    [Authorize(Roles = "Admin, Category Admin")]
    public class CategoryController : Controller
    {
        private readonly IResponseService _responseService;
        private readonly ICategoryService _CategoryService;
        private readonly ICategoryService _services;
        private readonly IMapper _mapper;

        public CategoryController(IResponseService responseService,
            ICategoryService services, IMapper mapper, ICategoryService CategoryService)
        {
            _responseService = responseService;
            _services = services;
            _mapper = mapper;
            _CategoryService = CategoryService;
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Index()
        {
            return View();
        }

        //[Authorize(Roles = "Admin")]
        //[Route("/CategoryCreate")]
        //public IActionResult CategoryCreate()
        //{
        //    return View();
        //}

        //[Authorize(Roles = "Admin")]
        //[Route("/CategoryUpdate/{id}")]
        //public async Task<IActionResult> CategoryUpdate(int id)
        //{
        //    var data = await _services.GetByIdIncludeThenIncludeAsync(id, false);
        //    return View(data);
        //}

        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> GetCategoryJson(int CategoryId)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            var response = await _services.GetByIdAsync(CategoryId);

            return Json(response);
        }


        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> GetCategories()
        {

            var response = await _services.GetAllAsync();

            return Json(response);
        }


        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> CreateJson(CategoryVM Category)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            var response = await _services.AddAsync(_mapper.Map<Categories>(Category));

            TempData["CategoryMessage"] = "Added successfully!";
            return Json(_responseService.HandleSuccess("Added successfully!"));
        }

        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> UpdateJson(CategoryUpdateVM CategoryUpdate)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            await _services.UpdateAsync(_mapper.Map<Categories>(CategoryUpdate));

            TempData["CategoryMessage"] = "Updated successfully!";
            return Json(_responseService.HandleSuccess("Updated successfully!"));
        }


        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> RemoveJson(int id)
        {
            var data = await _services.GetByIdAsync(id);

            await _services.RemoveAsync(data);
            return Json(_responseService.HandleSuccess("Successfully Deleted!"));
        }






        //[Authorize(Roles = "Admin")]
        //[ValidateAntiForgeryToken]
        //[HttpPost]
        //public async Task<JsonResult> TableData(int draw, int start, int length, string orderColumnName, string orderDir, [FromForm] Search search)
        //{
        //    var data = await _services.TableDataAsync(new DataTableModel()
        //    {
        //        draw = draw,
        //        start = start,
        //        lenght = length,
        //        orderColumnName = orderColumnName,
        //        orderDir = orderDir,
        //        search = search
        //    });
        //    return Json(new { draw = data.draw, recordsFiltered = data.recordsTotal, recordsTotal = data.recordsTotal, data = data.data });
        //}

    }
}
