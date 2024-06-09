using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Category
{
    public class CategoryDto
    {
        [Required]
        public string Name { get; set; }

        public bool? AvailableMenu { get; set; }
    }
}
