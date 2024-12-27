using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.viewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.Web.Controllers
{

    [Authorize(Roles = "Admin")]
    public class InstructorController : Controller
    {
        private readonly IInstructorService _service;
        private readonly IResponseService _responseService;
        private readonly IMapper _mapper;

        public InstructorController(IInstructorService service, IResponseService responseService, IMapper mapper)
        {
            _service = service;
            _responseService = responseService;
            _mapper = mapper;
        }

        public IActionResult Index()
        {
            return View();
        }







        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> GetInstructors()
        {
            try
            {
                var response = await _service.GetAllAsync();

                return Json(response);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
                //throw;
            }

        }


        [ValidateAntiForgeryToken]
        public async Task<JsonResult> CreateJson(InstructorVM Instructor)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            var response = await _service.AddAsync(_mapper.Map<Instructors>(Instructor));

            TempData["InstructorMessage"] = "Added successfully!";
            return Json(_responseService.HandleSuccessData("Added successfully!", response.Id));
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> UpdateJson(InstructorUpdateVM InstructorUpdate)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState }); // Hata Kontrol
            await _service.UpdateAsync(_mapper.Map<Instructors>(InstructorUpdate));


            TempData["InstructorMessage"] = "Updated successfully!";
            return Json(_responseService.HandleSuccessData("Updated successfully!", InstructorUpdate.Id));
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<JsonResult> RemoveJson(int id)
        {
            var data = await _service.GetByIdAsync(id);


            await _service.RemoveAsync(data);

            return Json(_responseService.HandleSuccess("Successfully Deleted!"));
        }

        //[ValidateAntiForgeryToken]
        //[HttpPost]
        //public async Task<JsonResult> TableData(int draw, int start, int length, string orderColumnName, string orderDir, [FromForm] Search search)
        //{
        //    var data = await _service.TableDataAsync(new DataTableModel()
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
