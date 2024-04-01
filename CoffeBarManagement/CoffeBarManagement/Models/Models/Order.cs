using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public DateTime? OrderDate { get; set; }

    public int? OrderStatus { get; set; }

    public int? ClientId { get; set; }

    public int? EmployeeId { get; set; }

    public int? TableId { get; set; }

    public double? Tips { get; set; }

    public virtual Client Client { get; set; }

    public virtual Employee Employee { get; set; }

    public virtual ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

    public virtual Table Table { get; set; }
}
