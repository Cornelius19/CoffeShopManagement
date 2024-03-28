using CoffeBarManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CoffeBarManagement.Services
{
    public class JWTService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly SymmetricSecurityKey _jwtKey;

        public JWTService(IConfiguration config, UserManager<User> userManager)
        {
            _config = config;
            _userManager = userManager;
            //our jwtKey in bytes
            _jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
        }

        //public string CreateJWT(User user)
        //{
        //    //our claims inside our token
        //    var userClaims = new List<Claim>
        //    {
        //        new Claim(ClaimTypes.NameIdentifier, user.Id),
        //        new Claim(ClaimTypes.Email, user.Email),
        //        new Claim(ClaimTypes.GivenName, user.FirstName),
        //        new Claim(ClaimTypes.Surname, user.LastName),

        //    };

        //    var credentials = new SigningCredentials(_jwtKey, SecurityAlgorithms.HmacSha256Signature);
        //    var tokenDescriptor = new SecurityTokenDescriptor
        //    {
        //        Subject = new ClaimsIdentity(userClaims),
        //        Expires = DateTime.UtcNow.AddDays(int.Parse(_config["JWT:ExpiresInDays"])),
        //        SigningCredentials = credentials,
        //        Issuer = _config["JWT:Issuer"]
        //    };

        //    var tokenHandler = new JwtSecurityTokenHandler();
        //    var jwt = tokenHandler.CreateToken(tokenDescriptor);
        //    return tokenHandler.WriteToken(jwt);
        //}
        public async Task<string> CreateJWT(User user)
        {
            // Get user roles from ASP.NET Identity
            var userRoles = await _userManager.GetRolesAsync(user);

            // Create claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName)
            };

            // Add role claims securely
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"])),
                SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(int.Parse(_config["JWT:ExpiresInDays"])),
                SigningCredentials = credentials,
                Issuer = _config["JWT:Issuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwt = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(jwt);
        }



    }
}
