using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Product;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;

        public ProductsController(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("add-new-product-noncomplex")]
        public async Task<IActionResult> AddNewProduct(ProductDto model)
        {
            //check if a product with same name already exist (because evenfor similar products we can change the name like cola330ml cola1500ml and stuff like this)
            var result = await _applicationContext.Products.Where(p => p.Name == model.Name).FirstOrDefaultAsync();
            if (result != null) { return BadRequest("A prduct with this name already exist!"); }
            try
            {
                var productToAdd = new Product
                {
                    Name = model.Name.ToLower(),
                    UnitPrice = model.UnitPrice,
                    UnitMeasure = model.UnitMeasure.ToLower(),
                    AvailableForUser = model.AvailableForUser,
                    ComplexProduct = false,
                    CategoryId = model.CategoryId,
                    Quantity = model.Quantity,
                    SupplyCheck = model.SupplyCheck,
                };
                await _applicationContext.Products.AddAsync(productToAdd);
                await _applicationContext.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("Something went wrong on adding a new nonComplex product!");
            }
            return Ok($"Product {model.Name} was successfuly added!");
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("add-new-product-complex")]
        public async Task<IActionResult> AddNewComplexProduct(ComplexProductDto model)
        {
            //check if a product with same name already exist (because evenfor similar products we can change the name like cola330ml cola1500ml and stuff like this)
            var result = await _applicationContext.Products.Where(p => p.Name == model.Name).FirstOrDefaultAsync();
            if (result != null) { return BadRequest("A prduct with this name already exist!"); }
            var idArray = model.ProductComponenetsId.ToArray();
            foreach (var id in idArray)
            {
                var checkExitence = await _applicationContext.Products.FindAsync(id);
                if (checkExitence == null)
                {
                    return BadRequest("Components contain an id from an unexistence product!");
                }

            }
            if (idArray.Length == 0) { return BadRequest("A complex product should have some products to be made of"); }
            bool areUnique = idArray.Distinct().Count() == idArray.Length;
            if (!areUnique) return BadRequest("You can't duplicate components items!");
            try
            {
                var productToAdd = new Product
                {
                    Name = model.Name.ToLower(),
                    UnitPrice = model.UnitPrice,
                    UnitMeasure = model.UnitMeasure.ToLower(),
                    AvailableForUser = model.AvailableForUser,
                    ComplexProduct = true,
                    CategoryId = model.CategoryId,
                    Quantity = 0,
                    SupplyCheck = 0,
                };
                await _applicationContext.Products.AddAsync(productToAdd);
                await _applicationContext.SaveChangesAsync();

                foreach (var item in idArray)
                {
                    var componentProduct = new ComplexProductsComponent
                    {
                        TargetProductId = productToAdd.ProductId,
                        ComponentProductId = item,
                    };
                    await _applicationContext.ComplexProductsComponents.AddAsync(componentProduct);
                    await _applicationContext.SaveChangesAsync();
                }

            }
            catch
            {
                return BadRequest("Something went wrong on adding a new nonComplex product!");
            }
            return Ok($"Product {model.Name} was successfuly added!");
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("get-stock")]
        public async Task<List<Product>> GetStock()
        {
            return await _applicationContext.Products.ToListAsync();
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("supply-check")]
        public async Task<List<Product>> SupplyCheck()
        {
            var reportProductList = new List<Product>();
            var productsToCheck = await _applicationContext.Products.ToListAsync();
            if (productsToCheck.Count <= 0)
            {
                return new List<Product>();
            }
            foreach (var product in productsToCheck)
            {
                if (product.Quantity <= product.SupplyCheck & product.ComplexProduct == false)
                {
                    reportProductList.Add(product);
                }
            }
            return reportProductList;
        }

        [HttpGet("get-menu-products/{categoryId}")]
        public async Task<List<GetMenuProductDto>> GetMenuProducts(int categoryId)
        {
            var result = await _applicationContext.Products.Where(q => q.CategoryId == categoryId && q.AvailableForUser == true).ToListAsync();
            if(result == null) return new List<GetMenuProductDto>();
            var categoryProducts = new List<GetMenuProductDto>();
            foreach (var item in result)
            {
                var product = new GetMenuProductDto
                {
                    ProductId = item.ProductId,
                    ProductName = item.Name,
                    ProductPrice = item.UnitPrice,
                    ProductAvailability = item.Quantity,
                    ProductSupplyCheck = item.SupplyCheck,
                    ComplexProduct = item.ComplexProduct
                };
                categoryProducts.Add(product);
            }
            return categoryProducts;
        }



    }
}
