using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguageController : ControllerBase
    {
        private readonly ILanguageService _languageService;
        private readonly IResponseService _responseService;

        public LanguageController(ILanguageService languageService, IResponseService responseService)
        {
            _languageService = languageService;
            _responseService = responseService;
        }

        [HttpGet("GetLanguage")]
        public async Task<Languages> GetLanguage(int languageId)
        {
            var data = await _languageService.GetByIdAsync(languageId, false);
            return data;
        }
        [HttpGet("GetLanguages")]
        public async Task<IEnumerable<Languages>> GetLanguageSelect()
        {
            var data = await _languageService.GetAllAsync(false);
            return data;
        }
    }
}
