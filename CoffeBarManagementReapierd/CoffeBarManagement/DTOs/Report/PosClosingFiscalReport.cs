namespace CoffeBarManagement.DTOs.Report
{
    public class PosClosingFiscalReport
    {
        public string CompanyName { get; set; }
        public string Adress { get; set; }
        public string City { get; set; }
        public int? CUI { get; set; }
        public DateTime CurrentDate { get; set; }
        public int FinishedOrdersCounter { get; set; }

        public double? TotalOrdersValue { get; set; }
        public double? Total9Tva { get; set; }
        public double? Total19Tva { get; set; }

    }
}
