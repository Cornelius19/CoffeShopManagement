using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Product
{
    public class ProductQuantityDto
    {
        [Required]
        public int orderId { get; set; }
        [Required]
        public int? productId { get; set; }
        [Required]
        public double? unitPrice { get; set; }
        [Required]
        public int? quantity { get; set; }
    }
}
