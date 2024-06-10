namespace CoffeBarManagement.DTOs.Product
{
    public class GetMenuProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public double? ProductPrice { get; set; }
        public int? ProductAvailability { get; set; }
        public int? ProductSupplyCheck { get; set; }

        public bool? ComplexProduct { get; set; }
        public int? Tva { get; set; }
    }
}
