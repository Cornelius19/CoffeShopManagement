using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Account;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Dependencis.ADMIN_ROLE)]
    public class TablesController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;

        public TablesController(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }

        [HttpPost("add-table")]
        public async Task<IActionResult> AddTable(TabelDto model)
        {
            var tableToAdd = new Table
            {
                Capacity = model.Capacity,
                TableStatus = model.Status,
            };
            await _applicationContext.AddAsync<Table>(tableToAdd);
            await _applicationContext.SaveChangesAsync();
            return Ok("Table was succseffuly added!");
        }
    }
}
