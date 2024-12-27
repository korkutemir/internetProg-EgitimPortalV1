using BuildBackEnd.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMemberService _memberService;
        private readonly IResponseService _responseService;

        public UserController(IMemberService memberService, IResponseService responseService)
        {
            _memberService = memberService;
            _responseService = responseService;
        }





    }
}
