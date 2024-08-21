using CoffeBarManagement.DTOs.Product;

namespace CoffeBarManagement.DTOs.Order
{
    public class GetOrderByTableDto
    {
        public int OrderId { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? TableId { get; set; }
        public string TakeEmployeeName { get; set; }
        public string FinishEmployeeName { get; set; }
        public string ClientName { get; set; }
        public string Status { get; set; }

        public List<OrderProductDto> products { get; set; }
    }
}
