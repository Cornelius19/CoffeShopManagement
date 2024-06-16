using CoffeBarManagement.Data;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;
        public ReportsController(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }


        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("get-stock-products-report/{categoryId}")]
        public async Task<List<Product>> GetStockProductsReport(int categoryId)
        {
            if (categoryId != 0)
            {
                return await _applicationContext.Products.Where(q => q.CategoryId == categoryId && q.ComplexProduct == false).ToListAsync();
            }
            return await _applicationContext.Products.Where(q => q.ComplexProduct == false).ToListAsync();
        }
    }
}
