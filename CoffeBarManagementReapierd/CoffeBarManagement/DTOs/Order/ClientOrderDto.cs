using CoffeBarManagement.DTOs.Product;

namespace CoffeBarManagement.DTOs.Order
{
    public class ClientOrderDto
    {
        public List<ProductQuantityDto> Products { get; set; }
    }
}
