using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class RemoveCategory
{
    public int RemoveCategoryId { get; set; }

    public string RemoveCategoryName { get; set; }

    public virtual ICollection<StockBalance> StockBalances { get; set; } = new List<StockBalance>();
}
