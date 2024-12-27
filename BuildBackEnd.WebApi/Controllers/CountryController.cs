using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildBackEnd.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _CountryService;
        private readonly IResponseService _responseService;

        public CountryController(ICountryService CountryService, IResponseService responseService)
        {
            _CountryService = CountryService;
            _responseService = responseService;
        }

        [HttpGet("GetCountry")]
        public async Task<Countries> GetCountry(int CountryId)
        {
            var data = await _CountryService.GetByIdIncludeThenIncludeAsync(CountryId, false, include: i => i.Include(i => i.User));
            return data;
        }

        [HttpGet("GetCountries")]
        public async Task<IEnumerable<Countries>> GetCountrySelect()
        {
            var data = await _CountryService.GetAllAsync(false);
            return data;
        }
    }
}
