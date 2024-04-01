using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Account
{
    public class ReservationDto
    {
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime Reservationdate { get; set; }
        [Required]
        [Range(1,10)]
        public int GuestNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool ReservationStatus { get; set; } = false;
        [Required]
        public int Duration { get; set; }
        public int? ClientId { get; set; }//value from userDto after login
        [Required]
        public int TableId { get; set; }

    }
}
