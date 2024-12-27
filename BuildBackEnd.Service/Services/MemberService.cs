using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.SelectModels;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.TableModels;
using BuildBackEnd.Core.viewModels;
using BuildBackEnd.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Security.Claims;

namespace BuildBackEnd.Service.Services
{
    public class MemberService : IMemberService
    {

        private readonly UserManager<Users> _userManager;
        private readonly SignInManager<Users> _signInManager;
        private readonly AppDbContext _context;



        public MemberService(UserManager<Users> userManager, SignInManager<Users> signInManager, AppDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        public UserSelect UserSelect(string q, int page = 1, int pageSize = 10)
        {
            var filteredItems = _context.Users.Where(x => x.UserName.Contains(q ?? string.Empty, StringComparison.OrdinalIgnoreCase));

            var paginatedItems = filteredItems
                                  .Skip((page - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToList();

            return new UserSelect
            {
                items = paginatedItems,
                total_count = filteredItems.Count()
            };
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }
        public async Task<Users> FindByEmailAsync(string mail)
        {
            var user = await _userManager.FindByEmailAsync(mail);


            return user!;
        }
        public async Task<Users> FindByUserIdAsync(int userId)
        {
            var user = await _context.Users.SingleOrDefaultAsync(i => i.Id == userId);
            return user!;
        }

        public Users FindByUserId(int userId)
        {
            var user = _context.Users.SingleOrDefault(i => i.Id == userId);
            return user!;
        }

        public async Task<string> GetAccessFailedCountAsync(Users user)
        {
            var count = await _userManager.GetAccessFailedCountAsync(user);
            return count.ToString();

        }

        public async Task<bool> CheckPasswordAsync(string userName, string password)
        {
            var currentUser = (await _userManager.FindByNameAsync(userName))!;

            return await _userManager.CheckPasswordAsync(currentUser, password);
        }

        public async Task<(bool, IEnumerable<IdentityError>?)> ChangePasswordAsync(string userName, string oldPassword, string newPassword)
        {
            var currentUser = (await _userManager.FindByNameAsync(userName))!;

            var resultChangePassword = await _userManager.ChangePasswordAsync(currentUser, oldPassword, newPassword);

            if (!resultChangePassword.Succeeded)
            {
                return (false, resultChangePassword.Errors);
            }

            await _userManager.UpdateSecurityStampAsync(currentUser);
            await _signInManager.SignOutAsync();
            await _signInManager.PasswordSignInAsync(currentUser, newPassword, true, false);

            return (true, null);

        }




        public List<ClaimViewModel> GetClaims(ClaimsPrincipal principal)
        {
            return principal.Claims.Select(x => new ClaimViewModel()
            {
                Issuer = x.Issuer,
                Type = x.Type,
                Value = x.Value
            }).ToList();

        }


        public int GetRoleIdUser(int userId)
        {
            var userRole = _context.UserRoles.FirstOrDefault(i => i.UserId == userId)!;
            return userRole.RoleId;
        }



        public async Task<UserReturnModel> TableDataAsync(DataTableModel table)
        {
            var query = _context.Users.AsQueryable();

            // Arama
            if (!string.IsNullOrEmpty(table.search.value))
            {
                query = query.Where(i => i.Name.Contains(table.search.value) || i.Surname.Contains(table.search.value) || i.UserName.ToString().Contains(table.search.value));
            }

            int recordsTotal = await query.CountAsync();

            //Sıralama
            if (!string.IsNullOrEmpty(table.orderColumnName))
            {
                var ordering = table.orderDir.Equals("asc", StringComparison.OrdinalIgnoreCase) ? $"{table.orderColumnName} ascending" : $"{table.orderColumnName} descending";
                query = query.OrderBy(ordering);
            }


            var dataListTask = query.Skip(table.start).Take(table.lenght).ToListAsync();


            await Task.WhenAll(dataListTask);

            return (new UserReturnModel()
            {
                data = dataListTask.Result,
                draw = table.draw,
                recordsTotal = recordsTotal,
                recordsFiltered = recordsTotal
            });
        }

    }
}
