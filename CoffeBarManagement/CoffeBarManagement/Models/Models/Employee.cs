using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public double? Salary { get; set; }

    public string UserId { get; set; }

    public string Role { get; set; }

    public bool? Lock { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
