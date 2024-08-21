using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Account
{
    public class LoginDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
