using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class Reservation
{
    public int ReservationId { get; set; }

    public DateTime ReservationDate { get; set; }

    public int GuestNumber { get; set; }

    public bool? ReservationStatus { get; set; }

    public int? Duration { get; set; }

    public int? ClientId { get; set; }

    public int? TableId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string PhoneNumber { get; set; }

    public virtual Client Client { get; set; }

    public virtual Table Table { get; set; }
}
