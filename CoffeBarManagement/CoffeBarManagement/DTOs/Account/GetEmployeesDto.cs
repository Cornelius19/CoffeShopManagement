using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Account
{
    public class GetEmployeesDto
    {
        public int EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }       
        public string Email { get; set; }
        public double? Salary { get; set; }
        public string EmployeeRole { get; set; }
        public int? TotalCreatedOrders { get; set; }
        public int? TotalDelieveredOrders { get; set; }
        public bool? Lock { get; set; }
    }
}
