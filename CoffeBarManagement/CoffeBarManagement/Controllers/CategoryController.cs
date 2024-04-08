using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Category;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;

        public CategoryController(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }
        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpPost("add-category")]
        public async Task<IActionResult> AddCategory(CategoryDto model)
        {
            var result1 = _applicationContext.Categories.Where(q => q.CategoryName == model.Name);
            if(result1 != null) return BadRequest("Such a category already exist!");
            var categoryToAdd = new Category
            {
                CategoryName = model.Name,
            };
            try
            {
                var result = await _applicationContext.Categories.AddAsync(categoryToAdd);
                await _applicationContext.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("Something went wrong for adding a new category!");
            }
            return Ok($"A new category was added by name {model.Name}");
        }



        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("get-categories")]
        public async Task<List<Category>> GetCategorys()
        {
            var categorys = await _applicationContext.Categories.ToListAsync();
            return categorys;
        }
    }
}
