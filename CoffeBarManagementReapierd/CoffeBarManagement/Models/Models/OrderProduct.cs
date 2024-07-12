using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class OrderProduct
{
    public int OrderProductsId { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public double UnitPrice { get; set; }

    public int Quantity { get; set; }

    public virtual Order Order { get; set; }

    public virtual Product Product { get; set; }
}
