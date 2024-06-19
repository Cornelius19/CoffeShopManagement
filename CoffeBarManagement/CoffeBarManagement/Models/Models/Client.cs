using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class Client
{
    public int ClientId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string UserId { get; set; }

    public string PhoneNumber { get; set; }

    public bool? Lock { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
