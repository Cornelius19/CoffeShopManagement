namespace CoffeBarManagement.DTOs.StockBalance
{
    public class StockBalanceDto
    {
        public DateTime BalanceDate { get; set; }
        public int ProductId { get; set; }
        public int RemoveQuantity { get; set; }
        public int RemoveCategoryId { get; set; }
    }
}
