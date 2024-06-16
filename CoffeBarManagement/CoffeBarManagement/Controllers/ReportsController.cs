using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Report;
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
        public async Task<List<StockBalanceReportDto>> GetStockProductsReport(int categoryId)
        {
            var listToReturn = new List<StockBalanceReportDto>();
            if (categoryId != 0)
            {
                var products =  await _applicationContext.Products.Where(q => q.CategoryId == categoryId && q.ComplexProduct == false).ToListAsync();
                if (products.Count > 0) {
                    foreach (var product in products) {
                        var category = await _applicationContext.Categories.FindAsync(product.CategoryId);
                        var productToAdd = new StockBalanceReportDto
                        {
                            Name = product.Name,
                            Unit_price = product.UnitPrice,
                            CurrentStock = product.Quantity,
                            Tva = product.Tva,
                            CategoryName = category.CategoryName,
                            stockLimit = product.SupplyCheck,
                            uniteMeasure = product.UnitMeasure,

                        };
                        listToReturn.Add(productToAdd);
                    }
                    return listToReturn;
                }
            }
            else
            {
                var products = await _applicationContext.Products.Where(q => q.ComplexProduct == false).ToListAsync();
                if (products.Count > 0)
                {
                    foreach (var product in products)
                    {
                        var productToAdd = new StockBalanceReportDto
                        {
                            Name = product.Name,
                            Unit_price = product.UnitPrice,
                            CurrentStock = product.Quantity,
                            Tva = product.Tva,
                            CategoryName = "All",
                            stockLimit = product.SupplyCheck,
                            uniteMeasure = product.UnitMeasure,
                        };
                        listToReturn.Add(productToAdd);
                    }
                    return listToReturn;
                }
            }
            return listToReturn;
        }
    }
}
