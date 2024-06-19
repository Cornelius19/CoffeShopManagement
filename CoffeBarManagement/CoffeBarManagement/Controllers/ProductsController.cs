using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Product;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly Data.ApplicationContext _applicationContext;

        public ProductsController(Data.ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }


        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("add-new-product-noncomplex")]
        public async Task<IActionResult> AddNewProduct(StockProducts model)
        {
            //check if a product with same name already exist (because evenfor similar products we can change the name like cola330ml cola1500ml and stuff like this)
            var result = await _applicationContext.Products.Where(p => p.Name == model.Name).FirstOrDefaultAsync();
            if (result != null) { return BadRequest(new JsonResult(new { message = "A product with this name already exist!" })); }
            try
            {
                var productToAdd = new Product
                {
                    Name = model.Name,
                    UnitPrice = model.UnitPrice,
                    UnitMeasure = model.UnitMeasure.ToLower(),
                    AvailableForUser = model.AvailableForUser,
                    ComplexProduct = false,
                    CategoryId = model.CategoryId,
                    Quantity = model.Quantity,
                    SupplyCheck = model.SupplyCheck,
                    Tva = model.TVA,
                };
                await _applicationContext.Products.AddAsync(productToAdd);
                await _applicationContext.SaveChangesAsync();
            }
            catch
            {
                return BadRequest(new JsonResult(new { message = "Something went wrong on adding a new nonComplex product!" }));
            }
            return Ok(new JsonResult(new { message = $"Product {model.Name} was successfuly added!" }));
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("add-new-product-complex")]
        public async Task<IActionResult> AddNewComplexProduct(ComplexProductDto model)
        {
            //check if a product with same name already exist (because evenfor similar products we can change the name like cola330ml cola1500ml and stuff like this)
            var result = await _applicationContext.Products.Where(p => p.Name == model.Name).FirstOrDefaultAsync();
            if (result != null) { return BadRequest(new JsonResult(new { message = "A prduct with this name already exist!" })); }
            var idArray = model.ProductComponenetsId.ToList();
            foreach (var id in idArray)
            {
                var checkExitence = await _applicationContext.Products.FindAsync(id.id);
                if (checkExitence == null)
                {
                    return BadRequest("Components contain an id from an unexistence product!");
                }

            }
            if (idArray.Count == 0) { return BadRequest(new JsonResult(new { message = "A complex product should have some products to be made of" })); }
            bool areUnique = idArray.Distinct().Count() == idArray.Count;
            if (!areUnique) return BadRequest(new JsonResult(new { message = "You can't duplicate components items!" }));
            try
            {
                var productToAdd = new Product
                {
                    Name = model.Name,
                    UnitPrice = model.UnitPrice,
                    UnitMeasure = model.UnitMeasure.ToLower(),
                    AvailableForUser = model.AvailableForUser,
                    ComplexProduct = true,
                    CategoryId = model.CategoryId,
                    Quantity = 0,
                    SupplyCheck = 0,
                    Tva = model.Tva
                };
                await _applicationContext.Products.AddAsync(productToAdd);
                await _applicationContext.SaveChangesAsync();

                foreach (var item in idArray)
                {
                    var componentProduct = new ComplexProductsComponent
                    {
                        TargetProductId = productToAdd.ProductId,
                        ComponentProductId = item.id,
                        UsageQuantity = item.quantity,
                    };
                    await _applicationContext.ComplexProductsComponents.AddAsync(componentProduct);
                    await _applicationContext.SaveChangesAsync();
                }

            }
            catch
            {
                return BadRequest(new JsonResult(new { message = "Something went wrong on adding a new nonComplex product!" }));
            }
            return Ok(new JsonResult(new { message = $"Product {model.Name} was successfuly added!" }));
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpPut("modify-complex-product")]
        public async Task<IActionResult> ModifyComplexProduct(ComplexProductDto model)
        {
            var productToModify = await _applicationContext.Products.FindAsync(model.ProductId);
            if (productToModify == null) { return NotFound(); }
            productToModify.Quantity = 0;
            productToModify.SupplyCheck = 0;
            productToModify.Name = model.Name;
            productToModify.UnitPrice = model.UnitPrice;
            productToModify.UnitMeasure = model.UnitMeasure;
            productToModify.CategoryId = model.CategoryId;
            productToModify.Tva = model.Tva;
            productToModify.AvailableForUser = model.AvailableForUser;
            await _applicationContext.SaveChangesAsync();
            var componentProducts = await _applicationContext.ComplexProductsComponents.Where(q => q.TargetProductId == productToModify.ProductId).ToListAsync();
            foreach(var item in componentProducts)
            {
                _applicationContext.ComplexProductsComponents.Remove(item);
                await _applicationContext.SaveChangesAsync();
            }
            
            foreach(var item in model.ProductComponenetsId)
            {
                var result = await _applicationContext.ComplexProductsComponents.Where(q => q.TargetProductId == model.ProductId && q.ComponentProductId == item.id).FirstOrDefaultAsync();
                if (result == null) 
                {
                    var componentToAdd = new ComplexProductsComponent
                    {
                        TargetProductId = model.ProductId,
                        ComponentProductId = item.id,
                        UsageQuantity = item.quantity,
                    };
                    await _applicationContext.ComplexProductsComponents.AddAsync(componentToAdd);
                    await _applicationContext.SaveChangesAsync();
                    continue;
                }
                if(result.UsageQuantity == item.quantity)
                {
                    continue;
                }
                else
                {
                    result.UsageQuantity = item.quantity;
                    await _applicationContext.SaveChangesAsync();
                }
            }
            return Ok(new JsonResult(new { message = "Product was modified succesfully" }));
            

        }



        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("get-stock")]
        public async Task<List<StockProducts>> GetStock()
        {
            var returnList = new List<StockProducts>();
            var products = await _applicationContext.Products.ToListAsync();
            if (products.Count == 0) return new List<StockProducts>();

            foreach (var product in products)
            {
                var productToAdd = new StockProducts
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    UnitPrice = product.UnitPrice,
                    UnitMeasure = product.UnitMeasure,
                    AvailableForUser = product.AvailableForUser,
                    ComplexProduct = product.ComplexProduct,
                    CategoryId = product.CategoryId,
                    Quantity = product.Quantity,
                    SupplyCheck = product.SupplyCheck,
                    TVA = product.Tva,
                    ComponentProducts = new List<ComponentProductDto>()
                };
                if (product.ComplexProduct == true)
                {
                    var componentProducts = await _applicationContext.ComplexProductsComponents.Where(q => q.TargetProductId == product.ProductId).ToListAsync();
                    foreach (var componentProduct in componentProducts)
                    {
                        var componentProductToAdd = new ComponentProductDto
                        {
                            id = componentProduct.ComponentProductId,
                            name = componentProduct.ComponentProduct.Name,
                            quantity = componentProduct.UsageQuantity,
                        };
                        productToAdd.ComponentProducts.Add(componentProductToAdd);
                    }
                }
                returnList.Add(productToAdd);
            }
            return returnList;
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
            if (result == null) return new List<GetMenuProductDto>();
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

        [HttpGet("get-menu-allProducts")]
        public async Task<List<GetMenuProductDto>> GetMenuAllProducts()
        {
            var result = await _applicationContext.Products.Where(q => q.AvailableForUser == true).ToListAsync();
            if (result == null) return new List<GetMenuProductDto>();
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
                    ComplexProduct = item.ComplexProduct,
                    Tva = item.Tva
                };
                categoryProducts.Add(product);
            }
            return categoryProducts;
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpPut("modify-nonComplexProduct")]
        public async Task<IActionResult> ModifyNonComplexProduct(StockProducts model)
        {
            var productToModify = await _applicationContext.Products.FindAsync(model.ProductId);
            if (productToModify == null) return NotFound(new JsonResult(new { message = "The product cannot be found!" }));
            productToModify.Name = model.Name;
            productToModify.UnitPrice = model.UnitPrice;
            productToModify.UnitMeasure = model.UnitMeasure;
            productToModify.AvailableForUser = model.AvailableForUser;
            productToModify.ComplexProduct = false;
            productToModify.CategoryId = model.CategoryId;
            productToModify.Quantity = model.Quantity;
            productToModify.SupplyCheck = model.SupplyCheck;
            productToModify.Tva = model.TVA;

            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new { message = "Product was successfuly modified!" }));
        }


        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("get-component-products")]
        public async Task<List<GetProductComponentDto>> GetComponentProduct()
        {
            var listToReturn = new List<GetProductComponentDto>();
            var products = await _applicationContext.Products.Where(q => q.ComplexProduct == false).ToListAsync();
            foreach (var item in products)
            {
                var itemToAdd = new GetProductComponentDto
                {
                    id= item.ProductId,
                    name = item.Name,
                };
                listToReturn.Add(itemToAdd);
            }

            return listToReturn;
        }


        [Authorize(Roles = ("Admin,POS"))]
        [HttpGet("get-all-products-stockbalance")]
        public async Task<List<StockBalanceProductsDto>> GetAllProducts()
        {
            var list = new List<StockBalanceProductsDto>();
            var result = await _applicationContext.Products.Where(q => q.ComplexProduct == false).ToListAsync();
            if (result.Count > 0)
            {
                foreach (var item in result)
                {
                    var productToAadd = new StockBalanceProductsDto
                    {
                        name = item.Name,
                        id = item.ProductId,
                        quantity = item.Quantity,
                    };
                    list.Add(productToAadd);
                }
                return (list);
            }
            else
            {
                return null;
            }

        }


        [Authorize(Roles = "Admin, POS")]
        [HttpPost("add-stock-quantity")]
        public async Task<IActionResult> AddStockQuantity(List<AddProductsQuantityDto> model)
        {
            if (model.Count > 0)
            {
                foreach (var item in model)
                {
                    var productDetails = await _applicationContext.Products.FindAsync(item.ProductId);
                    productDetails.Quantity += item.Added_quantity;
                    await _applicationContext.SaveChangesAsync();
                }
                return Ok(new JsonResult(new { message = "Products quantities was succeffully modified!" }));
            }
            return BadRequest();
        }
    }
}
