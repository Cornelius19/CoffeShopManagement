using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Category;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Composition;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly Data.ApplicationContext _applicationContext;

        public CategoryController(Data.ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }
        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpPost("add-category")]
        public async Task<IActionResult> AddCategory(CategoryDto model)
        {
            var result1 = await _applicationContext.Categories.Where(q => q.CategoryName == model.Name).FirstOrDefaultAsync();
            if(result1 != null) return BadRequest(new JsonResult(new { message = "Such a category already exist!" }));
            var categoryToAdd = new Category
            {
                CategoryName = model.Name,
                AvailableMenu = model.AvailableMenu,
            };
            try
            {
                var result = await _applicationContext.Categories.AddAsync(categoryToAdd);
                await _applicationContext.SaveChangesAsync();
            }
            catch
            {
                return BadRequest(new JsonResult(new { message = "Something went wrong for adding a new category!"}));
            }
            return Ok(new JsonResult(new { message = $"A new category was added by name {model.Name}" }));
        }


        [HttpGet("get-all-categories")]
        public async Task<List<GetCategoryDto>> GetAllCategorys()
        {
            var categorys = await _applicationContext.Categories.ToListAsync();
            var getCategory = new List<GetCategoryDto>();
            foreach (var category in categorys) 
            {
                var categoryToShow = new GetCategoryDto
                {
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                    AvailableMenu = category.AvailableMenu
                };
                getCategory.Add(categoryToShow);
            }
            return getCategory;
        }

        [HttpGet("get-menu-categories")]
        public async Task<List<GetCategoryDto>> GetMenuCategorys()
        {
            var categorys = await _applicationContext.Categories.ToListAsync();
            var getCategory = new List<GetCategoryDto>();
            foreach (var category in categorys)
            {
                if(category.AvailableMenu == true)
                {
                    var categoryToShow = new GetCategoryDto
                    {
                        CategoryId = category.CategoryId,
                        CategoryName = category.CategoryName,
                        AvailableMenu = category.AvailableMenu
                    };
                    getCategory.Add(categoryToShow);
                }
            }
            return getCategory;
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpPut("modify-product-category")]
        public async Task<IActionResult> ModifyProductCategory(GetCategoryDto model)
        {
            var result = await _applicationContext.Categories.FindAsync(model.CategoryId);
            if(result == null) return NotFound(new JsonResult(new { message = "Category was not found!" }));
            result.CategoryName = model.CategoryName;
            result.AvailableMenu = model.AvailableMenu;
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new { message = "Modification was applied!" }));
        }
    }
}
