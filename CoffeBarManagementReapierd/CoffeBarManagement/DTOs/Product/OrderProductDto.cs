namespace CoffeBarManagement.DTOs.Product
{
    public class OrderProductDto
    {
        public string productName { get; set; }
        public int? productId { get; set; }
        
        public double? unitPrice { get; set; }
       
        public int? quantity { get; set; }
        public int? tva { get; set; }
    }
}

