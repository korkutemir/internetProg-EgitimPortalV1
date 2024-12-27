using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Response;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.Translation;
using BuildBackEnd.Service.Services.Localization;
using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILanguageService _languageService;
        private readonly IResponseService _responseService;

        private readonly IMapper _mapper;
        private readonly LocalizationService<CategoryTranslations, CategoryDetails> _localizationService;

        public CategoryController(ICategoryService categoryService, ILanguageService languageService, IResponseService responseService, IMapper mapper, LocalizationService<CategoryTranslations, CategoryDetails> localizationService)
        {
            _categoryService = categoryService;
            _languageService = languageService;
            _responseService = responseService;
            _mapper = mapper;
            _localizationService = localizationService;
        }

        [HttpGet("GetCategories")]
        public async Task<ResponseAjax> GetAllCategories(int languageId)
        {
            var lang = await _languageService.GetByIdAsync(languageId, false);
            var data = await _categoryService.GetAllAsync();

            return _responseService.HandleSuccessData("Successful!", lang.Id != 1 ? await TranslateAsync(data.OrderBy(i => i.OrderNo), lang.LanguageCode) : data.OrderBy(i => i.OrderNo));
        }



        private async Task<List<Categories>> TranslateAsync(IEnumerable<Categories> datas, string languageCode)
        {
            var translationTasks = datas.Select(async data =>
            {
                var translation = await _localizationService.iGetTranslationForLanguageAsync(data.Id, languageCode);
                return translation != null ? _mapper.Map(translation, data) : data;
            });

            var translatedProducts = await Task.WhenAll(translationTasks);
            return translatedProducts.ToList();
        }



    }
}
