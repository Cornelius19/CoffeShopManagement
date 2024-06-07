using System;
using System.Collections.Generic;

namespace CoffeBarManagement.Models.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string Name { get; set; }

    public double? UnitPrice { get; set; }

    public string UnitMeasure { get; set; }

    public bool? AvailableForUser { get; set; }

    public bool? ComplexProduct { get; set; }

    public int? CategoryId { get; set; }

    public int? Quantity { get; set; }

    public int? SupplyCheck { get; set; }

    public int? Tva { get; set; }

    public virtual Category Category { get; set; }

    public virtual ICollection<ComplexProductsComponent> ComplexProductsComponentComponentProducts { get; set; } = new List<ComplexProductsComponent>();

    public virtual ICollection<ComplexProductsComponent> ComplexProductsComponentTargetProducts { get; set; } = new List<ComplexProductsComponent>();

    public virtual ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

    public virtual ICollection<StockBalance> StockBalances { get; set; } = new List<StockBalance>();
}
