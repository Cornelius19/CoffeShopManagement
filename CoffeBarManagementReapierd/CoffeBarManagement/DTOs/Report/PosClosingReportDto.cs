namespace CoffeBarManagement.DTOs.Report
{
    public class PosClosingReportDto
    {
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ForDay { get; set; }

        public int FinishedOrdersCounter { get; set; }
        public int CanceledOrdersCounter { get; set; }
        public double? TotalOrdersValue { get; set; }

        public List<EmployeeOrdersDto> EmployeesOrders { get; set; }

        public List<ProductSellPerDayDto> Products { get; set; }

    }
}
