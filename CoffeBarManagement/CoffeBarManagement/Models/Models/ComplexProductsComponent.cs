using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class ComplexProductsComponent
{
    public int CpcId { get; set; }

    public int? TargetProductId { get; set; }

    public int? ComponentProductId { get; set; }

    public int? UsageQuantity { get; set; }

    public virtual Product ComponentProduct { get; set; }

    public virtual Product TargetProduct { get; set; }
}
