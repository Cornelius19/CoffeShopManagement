using CoffeBarManagement.Models.IdentityModels;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.Models.Models
{
    public class Client
    {
        [Key]
        public int User_Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }

        public string UserId { get; set; } //Foreing key to User from identity

    }
}
