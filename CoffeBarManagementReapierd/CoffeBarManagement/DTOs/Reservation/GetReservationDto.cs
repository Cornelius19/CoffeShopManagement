using System.ComponentModel.DataAnnotations;

namespace CoffeBarManagement.DTOs.Reservation
{
    public class GetReservationDto
    {
        public int ReservationId { get; set; }
        [Required]
        public DateTime Reservationdate { get; set; }
        [Required]
        [Range(1, 10)]
        public int GuestNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool? ReservationStatus { get; set; } = false;
        [Required]
        public int? Duration { get; set; }
        [Required]
        public int? TableNumber { get; set; }
    }
}
