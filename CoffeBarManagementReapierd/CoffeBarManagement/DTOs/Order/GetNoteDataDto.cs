using CoffeBarManagement.DTOs.Product;

namespace CoffeBarManagement.DTOs.Order
{
    public class GetNoteDataDto
    {
        public string OrganizationName { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? TableId { get; set; }

        public List<OrderProductInformationDto> products { get; set; }
        public string EmployeeName { get; set; }
        public int OrderId { get; set; }
        public string OrderStatus { get; set; }

        public double? total { get; set; }

    }
}
