namespace CoffeBarManagement.DTOs.Report
{
    public class GetClientDataDto
    {
        public int ClientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public int OrdersCount { get; set; }

        public double? OrdersValue { get; set; }

        public bool? Lock { get; set; }
    }
}
