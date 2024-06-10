using CoffeBarManagement.DTOs.Product;
using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Order
{
    public class EmployeeOrderDto
    {
        public int TableId { get; set; }
        public List<ProductQuantityDto> Products { get; set; }

    }
}
