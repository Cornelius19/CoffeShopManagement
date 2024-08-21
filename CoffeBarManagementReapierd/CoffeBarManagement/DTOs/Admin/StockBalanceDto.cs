namespace CoffeBarManagement.DTOs.Admin
{
    public class StockBalanceDto
    {
        public DateTime? StockBalanceDate { get; set; }

        public string ProductName { get; set; }
        public int? RemovedQuantity { get; set; }
        public string CategoryName { get; set; }
    }
}
