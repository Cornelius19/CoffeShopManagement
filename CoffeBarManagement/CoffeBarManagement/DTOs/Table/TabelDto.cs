using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Table
{
    public class TabelDto
    {
        [Required]
        [Range(1, 10)]
        public int Capacity { get; set; }
        public bool Status { get; set; } = false;
    }
}
