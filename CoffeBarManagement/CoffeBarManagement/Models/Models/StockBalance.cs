using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class StockBalance
{
    public int StockBalanceId { get; set; }

    public DateTime? BalanceDate { get; set; }

    public int? ProductId { get; set; }

    public int? RemoveQuantity { get; set; }

    public int? RemoveCategoryId { get; set; }

    public virtual Product Product { get; set; }

    public virtual RemoveCategory RemoveCategory { get; set; }
}
