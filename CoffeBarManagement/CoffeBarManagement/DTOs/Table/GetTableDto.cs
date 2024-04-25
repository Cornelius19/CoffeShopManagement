using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Table
{
    public class GetTableDto
    {
        public int tableID { get; set; }
        public int? Capacity { get; set; }
    }
}
