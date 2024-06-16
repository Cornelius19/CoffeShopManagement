using CoffeBarManagement.DTOs.Product;

namespace CoffeBarManagement.DTOs.Order
{
    public class GetReceiptDataDto
    {
        public string Name { get; set; }
        public string adress { get; set; }
        public int? CIF { get; set; }
        public string City { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<OrderProductDto> products { get; set; }
    }
}
