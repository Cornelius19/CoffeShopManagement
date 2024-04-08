using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Table;
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

        [HttpPut("change-table-capacity/{tableId}")]
        public async Task<IActionResult> ChangeTableCapacity(TabelDto model, int tableId)
        {
            var result = await _applicationContext.Tables.FindAsync(tableId);
            if (result == null)
            {
                return BadRequest("Such a table does not exist!");
            }
            result.Capacity = model.Capacity;
            await _applicationContext.SaveChangesAsync();
            return Ok($"New capacity for the table {tableId} is {model.Capacity} :D");
        }
    }
}
