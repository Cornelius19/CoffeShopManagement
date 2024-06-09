using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Account;
using CoffeBarManagement.Models.IdentityModels;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeBarManagement.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase 
    {
        private readonly Data.ApplicationContext _applicationContext;
        private readonly UserManager<User> _userManager;

        public AdminController(Data.ApplicationContext applicationContext, UserManager<User> userManager)
        {
            _applicationContext = applicationContext;
            _userManager = userManager;
        }


        [HttpPost("register-employee")]
        public async Task<IActionResult> RegisterEmployee(RegisterEmployeeDto model)
        {
            var checkEmailExist = await _userManager.Users.AnyAsync(x => x.Email == model.Email.ToLower());
            if (checkEmailExist)
            {
                return BadRequest($"An existing employee is using {model.Email}, email address. Please try with another email address!");
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

            await _userManager.AddToRoleAsync(userToAdd, Dependencis.EMPLOYEE_ROLE);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var userToAddInEmployee = new Employee
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                Email = model.Email.ToLower(),
                Salary = model.Salary,
                UserId = userToAdd.Id,
            };

            _applicationContext.Employees.Add(userToAddInEmployee);
            await _applicationContext.SaveChangesAsync();



            return Ok("A new employee account has been created!");
        }

        [HttpGet("get-users")]
        public async Task<List<Client>> GetAllUsers()
        {
            return await _applicationContext.Clients.ToListAsync();
        }

        [HttpGet("get-employees")]
        public async Task<List<Employee>> GetAllEmployee()
        {
            return await _applicationContext.Employees.ToListAsync();
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
    }
}
