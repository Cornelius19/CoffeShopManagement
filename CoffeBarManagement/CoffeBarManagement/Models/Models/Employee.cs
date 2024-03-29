using CoffeBarManagement.Models.IdentityModels;
using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.Models.Models
{
    public class Employee
    {
        [Key]
        public int Employee_Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public double Salary { get; set; }

        public string UserId { get; set; } //Foreing key to User from identity
    }
}
