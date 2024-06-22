using CoffeBarManagement.DTOs.Product;

namespace CoffeBarManagement.DTOs.Order
{
    public class GetOrderDetails
    {
        public int OrderId { get; set; }
        public DateTime? OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string ClientName { get; set; }
        public string TakenBy { get; set; }
        public string DelieveredBy { get; set; }
        public int? TableId { get; set; }
        public double? OrderValue { get; set; }

        public List<OrderProductDto> Products { get; set; }
    }
}
