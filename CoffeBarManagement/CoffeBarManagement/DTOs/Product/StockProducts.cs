namespace CoffeBarManagement.DTOs.Product
{
    public class StockProducts
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
        public int? TVA { get; set; }

        public List<ComponentProductDto> ComponentProducts { get; set; }
    }
}
