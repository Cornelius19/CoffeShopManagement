using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class Table
{
    public int TableId { get; set; }

    public int? Capacity { get; set; }

    public bool? TableStatus { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
