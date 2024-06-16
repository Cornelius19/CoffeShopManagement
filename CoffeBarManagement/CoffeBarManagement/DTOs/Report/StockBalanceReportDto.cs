namespace CoffeBarManagement.DTOs.Report
{
    public class StockBalanceReportDto
    {
        public string Name { get; set; }
        public int? CurrentStock { get; set; }
        public double? Unit_price { get; set; }
        public int? Tva { get; set; }
        public int? stockLimit { get; set; }
        public string CategoryName { get; set; }
        public string uniteMeasure { get; set; }
    }
}
