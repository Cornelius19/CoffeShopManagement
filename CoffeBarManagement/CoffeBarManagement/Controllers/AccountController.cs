﻿using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Account;
using CoffeBarManagement.Models.IdentityModels;
using CoffeBarManagement.Models.Models;
using CoffeBarManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Security.Claims;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly Data.ApplicationContext _applicationContext;

        public AccountController(JWTService jwtService,
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            Data.ApplicationContext applicationContext
           )
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _applicationContext = applicationContext;
        }

        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return await CreateApplicationUserDto(user);
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new JsonResult(new {title = "Error", message = "Invalid email or password!"}));
            }
            if (user.EmailConfirmed == false) return Unauthorized("Please confirm your email");
            if (user.LockoutEnabled == false) return Unauthorized(new JsonResult(new { title = "Account blocked!", message = "Your account has been blocked!" }));

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) return Unauthorized(new JsonResult(new { title = "Error", message = "Invalid email or password!" }));

            return await CreateApplicationUserDto(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if (await CheckEmailExistAsync(model.Email))
            {
                return BadRequest(new JsonResult(new { title = "Email registered", message = "This email is already used by another user!" }));
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

            var _roleAssigned = await _userManager.AddToRoleAsync(userToAdd, Dependencis.DEFAULT_ROLE);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var userToAddInClient = new Client
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                Email = model.Email.ToLower(),
                PhoneNumber = model.PhoneNumber.ToLower(),
                UserId = userToAdd.Id,
                Lock = false,
            };
            
            _applicationContext.Clients.Add(userToAddInClient);
            await _applicationContext.SaveChangesAsync();

            return Ok(new JsonResult(new {title = "Account created", message = "Your account was created!"}));
        }



        private async Task<UserDto> CreateApplicationUserDto(User user)
        {
            // Generate JWT token asynchronously
            var token = await _jwtService.CreateJWT(user);
            var client = _applicationContext.Clients.Where(q => q.UserId == user.Id).FirstOrDefault();
            var employee = _applicationContext.Employees.Where(q => q.UserId == user.Id).FirstOrDefault();
            var userId = 0;
            if (client != null)
            {
                userId = client.ClientId;
            }
            if (employee != null)
            {
                userId = employee.EmployeeId;
            }
            return new UserDto
            {
                UserId = userId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT = token
            };
        }

        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }


    }

    
}
