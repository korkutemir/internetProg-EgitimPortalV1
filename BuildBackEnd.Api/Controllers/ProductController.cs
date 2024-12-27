using Microsoft.AspNetCore.Mvc;

namespace BuildBackEnd.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {






        public ProductController()
        {
        }


        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            //var products = await _productService.GetAllAsync();

            return Ok("");
        }
    }
}
