using CoffeBarManagement.DTOs.Product;

namespace CoffeBarManagement.DTOs.Order
{
    public class GetClientOrderDto
    {
        public int OrderId { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? TableId { get; set; }
        public string EmployeeName { get; set; }
        public string Status { get; set; }

        public List<OrderProductInformationDto> products { get; set; }
        //public double? Total { get; set; }
    }
}
