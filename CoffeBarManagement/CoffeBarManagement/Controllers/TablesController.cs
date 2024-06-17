using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Table;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly Data.ApplicationContext _applicationContext;

        public TablesController(Data.ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
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
            return Ok(new JsonResult(new { message = "Table was succseffuly added!" }));
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
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
            return Ok(new JsonResult(new { message = $"New capacity for the table {tableId} is {model.Capacity} :D" }));
        }

        [Authorize]
        [HttpGet("get-all-tables")]
        public async Task<List<GetTableDto>> GetAllTables()
        {
            var tableList = new List<GetTableDto>();
            var result = await _applicationContext.Tables.ToListAsync();
            foreach(var table in result) 
            {
                var tableToAdd = new GetTableDto
                {
                    tableID = table.TableId,
                    Capacity = table.Capacity,
                    TableStatus = table.TableStatus,
                };
                tableList.Add(tableToAdd);
            }
            return tableList;
            
        }


        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("change-table-status")]
        public async Task<IActionResult> ChangeTableStatus(GetTableDto model)
        {
            var result = await _applicationContext.Tables.FindAsync(model.tableID);
            if(result == null) return NotFound(new JsonResult(new {message = "Table not found!"}));
            result.TableStatus = model.TableStatus;
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult( new { message = "Table status was changed!" } ));
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpDelete("delete-table/{tableId}")]
        public async Task<IActionResult> DeleteTable(int tableId)
        {
            var table = await _applicationContext.Tables.FindAsync(tableId);
            if (table == null) return NotFound(new JsonResult(new { message = "Table was not found" }));
            var orders = await _applicationContext.Orders.Where(q => q.TableId == tableId).ToListAsync();
            if (orders.Count > 0)
            {
                foreach (var order in orders)
                {
                    order.TableId = null;
                    await _applicationContext.SaveChangesAsync();
                }
                _applicationContext.Remove(table);
                await _applicationContext.SaveChangesAsync();
                return Ok(new JsonResult(new { message = "Table was deleted and all orders with this table modified!" }));
            }
            else
            {
                _applicationContext.Remove(table);
                await _applicationContext.SaveChangesAsync();
                return Ok(new JsonResult(new { message = "Table was deleted and there were no orders with this table!" }));
            }
        }
    }
}
