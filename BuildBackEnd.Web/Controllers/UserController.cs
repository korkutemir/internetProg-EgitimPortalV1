using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.TableModels;
using BuildBackEnd.Core.viewModels.User;
using BuildBackEnd.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.Controllers
{

    public class UserController : Controller
    {
        private readonly UserManager<Users> _userManager;
        private readonly RoleManager<UserRole> _roleManager;
        private readonly IResponseService _responseService;
        private readonly IMemberService _memberService;
        private readonly ICategoryService _CategoryService;



        public UserController(UserManager<Users> userManager, RoleManager<UserRole> roleManager, IResponseService responseService, IMemberService memberService, ICategoryService CategoryService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _responseService = responseService;
            _memberService = memberService;
            _CategoryService = CategoryService;
        }




        [ValidateAntiForgeryToken]
        public IActionResult GetUserSelect(string q, int page = 1, int pageSize = 10)
        {
            return Ok(_memberService.UserSelect(q, page, pageSize));
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult UserCreate()
        {
            return View();
        }

        [Route("/UserUpdate/{id}")]
        public async Task<IActionResult> UserUpdate(int id)
        {
            var user = await _memberService.FindByUserIdAsync(id);
            if (user == null) return NotFound("User not found");


            var userRoles = await _userManager.GetRolesAsync(user);
            var role = userRoles.FirstOrDefault(); // Rol isimlerinden birincisini alıyoruz


            var model = new UserModelUpdate
            {
                Id = id,
                Name = user.Name,
                Surname = user.Surname,
                UserName = user.UserName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                Password = user.PasswordHash,
                Role = 2
            };
            return View(model); // Modeli View'e gönderiyoruz
        }



        [HttpPost]
        public async Task<IActionResult> UserAddJson(UserVM model)
        {

            //if (!ModelState.IsValid) return Json(new { errors = ModelState });

            // Kullanıcı adının zaten kullanılıp kullanılmadığını kontrol et
            var existingUser = await _userManager.FindByNameAsync(model.UserName);
            if (existingUser != null) return Json(_responseService.HandleError("Username already in use. Please choose a different username."));

            var user = new Users { Name = model.Name, Surname = model.Surname, UserName = model.UserName, Email = model.Email, PhoneNumber = model.Phone };

            // Kullanıcıyı oluştur
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return Json(_responseService.HandleError("Error adding user: " + result.Errors.First().Description));
            }

            // Güvenlik damgasını güncelle
            await _userManager.UpdateSecurityStampAsync(user);

            // Rolü bul ve kullanıcıya ekle
            var role = await _roleManager.FindByIdAsync(model.Role.ToString());
            var roleResult = await _userManager.AddToRoleAsync(user, "USER");
            if (!roleResult.Succeeded)
            {
                return Json(_responseService.HandleError("Error adding user to role."));
            }


            TempData["UserMessage"] = "User added successfully!";
            return Json(_responseService.HandleSuccess("User added successfully!"));

        }

        [HttpPost]
        public async Task<IActionResult> UserUpdateJson(UserUpdateVM model)
        {

            if (!ModelState.IsValid) return Json(new { errors = ModelState });

            var user = await _userManager.FindByIdAsync(model.Id.ToString());
            if (user == null) return Json(_responseService.HandleError("User Not Found!"));

            // Rol güncelleme
            var oldRoles = await _userManager.GetRolesAsync(user);
            var newRoleName = model.Role == 1 ? "Admin" : "Category Admin"; // Rol ID kontrolü düzeltildi
            if (!oldRoles.Contains(newRoleName))
            {
                // Kullanıcının eski rollerini kontrol edin ve gerekiyorsa kaldırın
                foreach (var role in oldRoles)
                {
                    if (role != newRoleName)
                        await _userManager.RemoveFromRoleAsync(user, role);
                }

                await _userManager.AddToRoleAsync(user, newRoleName);
            }
            user.Name = model.Name;
            user.Surname = model.Surname;
            user.UserName = model.UserName;
            user.Email = model.Email;
            user.PhoneNumber = model.Phone;


            // Şifre değişikliği kontrolü
            if (!string.IsNullOrEmpty(model.Password))
            {
                var passwordResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.Password);
                if (!passwordResult.Succeeded)
                    return Json(_responseService.HandleError(passwordResult.Errors.FirstOrDefault().Description + ": Error updating password."));
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return Json(_responseService.HandleError("Error updating user."));





            TempData["UserMessage"] = "User updated successfully!";
            return Json(_responseService.HandleSuccess("User updated successfully!"));
        }

        [ValidateAntiForgeryToken]
        public async Task<JsonResult> TableData(int draw, int start, int length, string orderColumnName, string orderDir, [FromForm] Search search)
        {


            var data = await _memberService.TableDataAsync(new DataTableModel()
            {
                draw = draw,
                start = start,
                lenght = length,
                orderColumnName = orderColumnName,
                orderDir = orderDir,
                search = search
            });

            return Json(new { draw = data.draw, recordsFiltered = data.recordsTotal, recordsTotal = data.recordsTotal, data = data.data });

        }

        [HttpPost]
        public async Task<JsonResult> RemoveJson(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());



            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Json(_responseService.HandleSuccess("User deleted successfully."));
            }
            return Json(new { success = false, message = result.Errors });
        }

    }
}
