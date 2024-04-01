using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class Organization
{
    public int OrganizationId { get; set; }

    public string Name { get; set; }

    public string Address { get; set; }

    public string LogoPath { get; set; }

    public bool? OpenStatus { get; set; }
}
