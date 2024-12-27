using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.Response;
using BuildBackEnd.Core.Services;
using BuildBackEnd.Core.Translation;
using BuildBackEnd.Service.Services.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildBackEnd.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ICategoryService _categoryService;
        private readonly ILanguageService _languageService;
        private readonly IResponseService _responseService;

        private readonly IMapper _mapper;
        private readonly LocalizationService<DoctorTranslations, DoctorDetails> _localizationService;

        public DoctorController(IDoctorService doctorService, ICategoryService categoryService, ILanguageService languageService, IResponseService responseService, IMapper mapper, LocalizationService<DoctorTranslations, DoctorDetails> localizationService)
        {
            _doctorService = doctorService;
            _categoryService = categoryService;
            _languageService = languageService;
            _responseService = responseService;
            _mapper = mapper;
            _localizationService = localizationService;
        }

        [HttpGet("GetDoctor")]
        public async Task<ResponseAjax> GetDoctor(int languageId, int doctorId)
        {

            var lang = await _languageService.GetByIdAsync(languageId, false);

            var doctor = await _doctorService.GetByIdIncludeThenIncludeAsync(doctorId, false, include: i => i.Include(i => i.Country));

            return _responseService.HandleSuccessData("Successful!", lang.Id != 1 ? await TranslateByAsync(doctor, lang.LanguageCode) : doctor);


        }




        //[HttpGet("GetSolutionToDoctor")]
        //public async Task<ResponseAjax> GetSolutionToDoctor(int languageId, int solutionId, int countryId, int page = 1, int pageSize = 10)
        //{
        //    var lang = await _languageService.GetByIdAsync(languageId, false);

        //    var solution = await _sectionService.GetByIdIncludeThenIncludeAsync(solutionId, false, include: i => i
        //    .Include(i => i.CaseSections)
        //    .ThenInclude(i => i.Case)
        //    .ThenInclude(i => i.CaseDoctors)
        //              .ThenInclude(i => i.Doctor).ThenInclude(i => i.Country));


        //    var doctors = solution.CaseSections
        //        .SelectMany(cs => cs.Case.CaseDoctors)
        //        .Select(cd => new DoctorUpdateVM
        //        {
        //            Id = cd.DoctorId,
        //            Name = cd.Doctor.Name,
        //            MediaName = cd.Doctor.MediaName,
        //            CreatedDate = cd.Doctor.CreatedDate,
        //            CountryId = cd.Doctor.CountryId,
        //            OrderNo = cd.Doctor.OrderNo,

        //        })
        //        .DistinctBy(i => i.Id).OrderBy(i => i.OrderNo)
        //        .Skip((page - 1) * pageSize).Take(pageSize).ToList(); // Eğer aynı doktor birden fazla vakada yer alıyorsa, tekrar eden girişleri kaldır

        //    var doctorMap = _mapper.Map<List<Doctors>>(doctors);

        //    return _responseService.HandleSuccessData("Successful!", lang.Id != 1 ? await TranslateAsync(doctorMap, lang.LanguageCode) : doctors);
        //}




        private async Task<List<Doctors>> TranslateAsync(IEnumerable<Doctors> datas, string languageCode)
        {
            var translationTasks = datas.Select(async data =>
            {
                var translation = await _localizationService.iGetTranslationForLanguageAsync(data.Id, languageCode);
                return translation != null ? _mapper.Map(translation, data) : data;
            });

            var translatedProducts = await Task.WhenAll(translationTasks);
            return translatedProducts.ToList();
        }

        private async Task<Doctors> TranslateByAsync(Doctors data, string languageCode)
        {
            var translation = await _localizationService.iGetTranslationForLanguageAsync(data.Id, languageCode);
            var mapTranslation = _mapper.Map(translation, data) ?? data;

            return mapTranslation;
        }

    }
}
