using CoffeBarManagement.Data;
using CoffeBarManagement.Data.IdentityDbContext;
using CoffeBarManagement.DTOs.Account;
using CoffeBarManagement.DTOs.Admin;
using CoffeBarManagement.DTOs.Report;
using CoffeBarManagement.Models.IdentityModels;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CoffeBarManagement.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase 
    {
        private readonly Data.ApplicationContext _applicationContext;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminController(Data.ApplicationContext applicationContext, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _applicationContext = applicationContext;
            _userManager = userManager;
            _roleManager = roleManager;
        }


        [HttpPost("register-employee")]
        public async Task<IActionResult> RegisterEmployee(RegisterEmployeeDto model)
        {
            string role = "";
            if (model.EmployeeRole == "POS") {
                role = "manager";
            }
            else
            {
                role = model.EmployeeRole;
            }
            var checkEmailExist = await _userManager.Users.AnyAsync(x => x.Email == model.Email.ToLower());
            if (checkEmailExist)
            {
                return BadRequest(new JsonResult(new { message =  $"An existing employee is using {model.Email}, email address. Please try with another email address!" }));
            }

            var userToAdd = new User
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
                EmailConfirmed = true,
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);

            await _userManager.AddToRoleAsync(userToAdd, model.EmployeeRole);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var userToAddInEmployee = new Employee
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                Email = model.Email.ToLower(),
                Salary = model.Salary,
                UserId = userToAdd.Id,
                Role = role.ToLower(),
                Lock = false
            };

            _applicationContext.Employees.Add(userToAddInEmployee);
            await _applicationContext.SaveChangesAsync();



            return Ok(new JsonResult(new { message = "A new employee account has been created!" }));
        }

        [HttpGet("get-users")]
        public async Task<List<Client>> GetAllUsers()
        {
            return await _applicationContext.Clients.ToListAsync();
        }

        [HttpGet("get-employees")]
        public async Task<List<GetEmployeesDto>> GetAllEmployee()
        {
            var listToReturn = new List<GetEmployeesDto>();
            var allEmployees = await _applicationContext.Employees.ToListAsync();
            if (allEmployees.Count > 0)
            {
                foreach (var employee in allEmployees)
                {
                    if(employee.Role != "admin")
                    {
                        var totalTakenOrder = await _applicationContext.Orders.Where(q => q.TakenEmployeeId == employee.EmployeeId).ToListAsync();
                        var totalDelieveredOrder = await _applicationContext.Orders.Where(q => q.DeliveredEmployeeId == employee.EmployeeId).ToListAsync();
                        var employeeToAdd = new GetEmployeesDto
                        {
                            FirstName = employee.FirstName,
                            LastName = employee.LastName,
                            Salary = employee.Salary,
                            EmployeeId = employee.EmployeeId,
                            EmployeeRole = employee.Role,
                            TotalCreatedOrders = totalTakenOrder.Count,
                            TotalDelieveredOrders = totalDelieveredOrder.Count,
                            Email = employee.Email,
                            Lock = employee.Lock,
                        };
                        listToReturn.Add(employeeToAdd);
                    }
                }
                return listToReturn;
            }
            return listToReturn;
        }


        [HttpDelete("delete-client/{id}")]
        public async Task<IActionResult> DeleteClientById(int id)
        {

            if (id <= 0)
            {
                return BadRequest("Invalid Id");
            }
            var clientToDelete = await _applicationContext.FindAsync<Client>(id);
            if (clientToDelete != null)
            {
                var userToDelete = await _userManager.FindByIdAsync(clientToDelete.UserId);
                if (clientToDelete == null) return BadRequest("There is no client with this id");
                var result = await _userManager.DeleteAsync(userToDelete);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
                _applicationContext.Clients.Remove(clientToDelete);
                await _applicationContext.SaveChangesAsync();
                return Ok($"Client with id = {id} was succesfully deleted!");

            }
            return BadRequest("Such an id does not exist in database!");
        }

        [HttpDelete("delete-employee/{id}")]
        public async Task<IActionResult> DeleteEmployeeById(int id)
        {

            if (id <= 0)
            {
                return BadRequest("Invalid Id");
            }
            var employeeToDelete = await _applicationContext.FindAsync<Employee>(id);
            if (employeeToDelete != null)
            {
                var userToDelete = await _userManager.FindByIdAsync(employeeToDelete.UserId);
                if (employeeToDelete == null) return BadRequest("There is no client with this id");
                var result = await _userManager.DeleteAsync(userToDelete);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
                _applicationContext.Employees.Remove(employeeToDelete);
                await _applicationContext.SaveChangesAsync();
                return Ok($"Employee with id = {id} was succesfully deleted!");

            }
            return BadRequest("No employee with this id, please check again employee for deletion!");
        }


        [HttpPut("lock-unlock-employee/{userId}/{status}")]
        public async Task<IActionResult> LockUnlockUser(int userId, bool status)
        {
            var employeeDetails = await _applicationContext.Employees.FindAsync(userId);
            if (employeeDetails != null)
            {
                var user = await _userManager.FindByIdAsync(employeeDetails.UserId);
                if (user != null) {
                    if (status)
                    {
                        employeeDetails.Lock = true;
                        user.LockoutEnabled = false;
                        await _applicationContext.SaveChangesAsync();
                        await _userManager.UpdateAsync(user);
                        return Ok(new JsonResult(new { message = "User access is blocked now!" }));
                    }
                    else
                    {
                        employeeDetails.Lock = false;
                        user.LockoutEnabled = true;
                        await _applicationContext.SaveChangesAsync();
                        await _userManager.UpdateAsync(user);
                        return Ok(new JsonResult(new { message = "User access is enabed now!" }));
                    }
                    
                }
                return NotFound();
            }
            return NotFound();

        }

        [HttpPut("lock-unlock-client/{userId}/{status}")]
        public async Task<IActionResult> LockUnlockClient(int userId, bool status)
        {
            var clientDetails = await _applicationContext.Clients.FindAsync(userId);
            if (clientDetails != null)
            {
                var user = await _userManager.FindByIdAsync(clientDetails.UserId);
                if (user != null)
                {
                    if (status)
                    {
                        clientDetails.Lock = true;
                        user.LockoutEnabled = false;
                        await _applicationContext.SaveChangesAsync();
                        await _userManager.UpdateAsync(user);
                        return Ok(new JsonResult(new { message = "User access is blocked now!" }));
                    }
                    else
                    {
                        clientDetails.Lock = false;
                        user.LockoutEnabled = true;
                        await _applicationContext.SaveChangesAsync();
                        await _userManager.UpdateAsync(user);
                        return Ok(new JsonResult(new { message = "User access is enabed now!" }));
                    }

                }
                return NotFound();
            }
            return NotFound();

        }

        [HttpPut("modify-employee")]
        public async Task<IActionResult> ModifyEmployee(ModifyEmployeeDto model)
        {
            var employee = await _applicationContext.Employees.FindAsync(model.employeeId);
            if (employee == null) {
                return NotFound();
            }
            else
            {
                string roleName = "";
                if (model.role == "manager")
                {
                    roleName = "POS";
                }
                else
                {
                    roleName = "Employee";
                }

                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    return BadRequest("Role does not exist.");
                }
                var user = await _userManager.FindByIdAsync(employee.UserId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Remove all current roles
                var currentRoles = await _userManager.GetRolesAsync(user);
                var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeRolesResult.Succeeded)
                {
                    return StatusCode(500, "Failed to remove user roles.");
                }

                // Add the new role to the user
                var addRoleResult = await _userManager.AddToRoleAsync(user, roleName);
                if (!addRoleResult.Succeeded)
                {
                    return StatusCode(500, "Failed to add user to role.");
                }

                employee.Salary = model.salary;
                employee.Role = model.role;
                await _applicationContext.SaveChangesAsync();
                return Ok(new JsonResult(new { message = "Modifications applied!" }));
            }
        }


        [HttpGet("get-orders-data-chart")]
        public async Task<List<OrdersDataChartDto>> GetMonthlyOrderStatistics()
        {
            var today = DateTime.Today;
            var startDate = new DateTime(today.Year, today.Month, 1).AddMonths(-11);

            var orders = await _applicationContext.Orders
           .Where(q => q.OrderDate >= startDate && q.OrderDate <= today && q.OrderStatus == 4)
           .ToListAsync();

            var orderDetails = await _applicationContext.OrderProducts
            .Where(od => orders.Select(o => o.OrderId).Contains(od.OrderId))
            .ToListAsync();

            var monthlyStatistics = new List<OrdersDataChartDto>();

            for (int i = 0; i < 12; i++)
            {
                var monthStart = startDate.AddMonths(i);
                var monthEnd = monthStart.AddMonths(1);

                var monthlyOrders = orders
                    .Where(o => o.OrderDate >= monthStart && o.OrderDate < monthEnd)
                    .ToList();

                var monthlyOrderDetails = orderDetails
                    .Where(od => monthlyOrders.Select(mo => mo.OrderId).Contains(od.OrderId))
                    .ToList();

                var ordersCounter = monthlyOrders.Count;
                var ordersValue = monthlyOrderDetails.Sum(od => od.Quantity * od.UnitPrice);

                monthlyStatistics.Add(new OrdersDataChartDto
                {
                    Month = monthStart.ToString("MMMM yyyy", CultureInfo.InvariantCulture),
                    OrdersCounter = ordersCounter,
                    OrdersValue = ordersValue
                });
            }

            return monthlyStatistics;
        }

        [HttpGet("get-orders-employees-chart")]
        public async Task<List<EmployeeOrdersDto>> GetEmployeeOrderStatistics()
        {
            var listToReturn = new List<EmployeeOrdersDto>();
            var employees = await _applicationContext.Employees.Where(e => e.Lock == false && e.Role != "admin").ToListAsync();
            if(employees.Count > 0)
            {
                foreach (var employee in employees) {
                    var takenOrders = await _applicationContext.Orders.Where(o => o.TakenEmployeeId == employee.EmployeeId && o.OrderStatus == 4).ToListAsync();
                    var delieveredOrders = await _applicationContext.Orders.Where(o => o.DeliveredEmployeeId == employee.EmployeeId && o.OrderStatus == 4).ToListAsync();
                    var employeeToAdd = new EmployeeOrdersDto
                    {
                        Name = employee.LastName,
                        TakenOrders = takenOrders.Count,
                        DelieveredOrders = delieveredOrders.Count
                    };
                    listToReturn.Add(employeeToAdd);
                }
                return listToReturn;
            }
            return listToReturn;
        }


        [HttpGet("get-clients-data")]
        public async Task<List<GetClientDataDto>> GetClientsData()
        {
            var listToReturn = new List<GetClientDataDto>();
            var clients = await _applicationContext.Clients.ToListAsync();
            if (clients.Count > 0)
            {
                foreach (var client in clients) 
                {
                    var orders = await _applicationContext.Orders.Where(q => q.ClientId == client.ClientId && q.OrderStatus == 4).ToListAsync();
                    var orderProducts = await _applicationContext.OrderProducts.Where(od => orders.Select(o => o.OrderId).Contains(od.OrderId)).ToListAsync();
                    var ordersCount = orders.Count;
                    var ordersValue = orderProducts.Sum(od => od.Quantity * od.UnitPrice);
                    var clientToAdd = new GetClientDataDto
                    {
                        ClientId = client.ClientId,
                        FirstName = client.FirstName,
                        LastName = client.LastName,
                        Email= client.Email,
                        PhoneNumber = client.PhoneNumber,
                        OrdersCount = ordersCount,
                        OrdersValue = ordersValue,
                        Lock = client.Lock,
                    };
                    listToReturn.Add(clientToAdd);
                } 
                return listToReturn;
            }
            return listToReturn;
        }

        [HttpGet("get-stock-balance-data")]
        public async Task<List<StockBalanceDto>> GetStockBalanceData()
        {
            var listToReturn = new List<StockBalanceDto>();
            var result = await _applicationContext.StockBalances.ToListAsync();
            foreach (var item in result) 
            {
                var productName = await _applicationContext.Products.Where(q => q.ProductId == item.ProductId).FirstOrDefaultAsync();
                var categoryName = await _applicationContext.RemoveCategories.Where(q => q.RemoveCategoryId == item.RemoveCategoryId).FirstOrDefaultAsync();
                var stockBalanceRecord = new StockBalanceDto
                {
                    StockBalanceDate = item.BalanceDate,
                    ProductName = productName.Name,
                    CategoryName = categoryName.RemoveCategoryName,
                    RemovedQuantity = item.RemoveQuantity,
                };
                listToReturn.Add(stockBalanceRecord);
            }
            return listToReturn;

        }   

    }
}
