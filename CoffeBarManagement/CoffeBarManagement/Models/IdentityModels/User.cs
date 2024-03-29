using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Identity;

namespace CoffeBarManagement.Models.IdentityModels
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    }
}
