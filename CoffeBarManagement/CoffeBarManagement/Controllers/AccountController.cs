﻿using CoffeBarManagement.DTOs.Account;
using CoffeBarManagement.Models;
using CoffeBarManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public AccountController(JWTService jwtService,
            SignInManager<User> signInManager,
            UserManager<User> userManager
           )
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
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
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }
            if (user.EmailConfirmed == false) return Unauthorized("Please confirm your email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid username or password");

            return await CreateApplicationUserDto(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if (await CheckEmailExistAsync(model.Email))
            {
                return BadRequest($"An existing account is using {model.Email}, email address. Please try with another email address!");
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



            return Ok("Your account has been created, you can login!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("get-users")]
        public async Task<List<User>> GetAllUsers()
        {
            var users = new List<User>();
            users = await _userManager.Users.ToListAsync(); // Get all users

            var userToShow = users.Select(x => new User
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
            }).ToList();

            return userToShow;
        }




        //private UserDto CreateApplicationUserDto(User user)
        //{
        //    return new UserDto
        //    {
        //        FirstName = user.FirstName,
        //        LastName = user.LastName,
        //        JWT = _jwtService.CreateJWT(user),
        //    };
        //}
        private async Task<UserDto> CreateApplicationUserDto(User user)
        {
            // Generate JWT token asynchronously
            var token = await _jwtService.CreateJWT(user);

            return new UserDto
            {
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
