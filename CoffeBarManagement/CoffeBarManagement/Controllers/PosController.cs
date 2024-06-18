using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Report;
using CoffeBarManagement.DTOs.StockBalance;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PosController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;
        public PosController(ApplicationContext context)
        {
            _applicationContext = context;
        }

        [Authorize(Roles = "Admin, POS")]
        [HttpPost("new-balace-record/{productID}/{categoryID}/{quantity}")]
        public async Task<IActionResult> NewBalanceStockRecords(int productID, int categoryID, int quantity)
        {
            var productDetails = await _applicationContext.Products.FindAsync(productID);
            if (productDetails != null) {
                if (quantity > productDetails.Quantity) { return BadRequest(new JsonResult(new { message = "Removabale quantity is bigger than the stock quantity!" })); }
                productDetails.Quantity -= quantity;
                var stockBalanceToAdd = new StockBalance
                {
                    ProductId = productID,
                    RemoveQuantity = quantity,
                    RemoveCategoryId = categoryID,
                    BalanceDate = DateTime.Now,
                };

                await _applicationContext.StockBalances.AddAsync(stockBalanceToAdd);
                await _applicationContext.SaveChangesAsync();
                return Ok(new JsonResult(new { message = "Quantity changed!" }));
            }
            return NotFound(new JsonResult(new { message = "Product not found in db!" }));

        }

        [Authorize(Roles = "Admin,POS")]
        [HttpPut("change-status-pos/{status}")]
        public async Task<IActionResult> OpenPos(bool status)
        {   
            var date = DateTime.Now;
            DateTime dateForComarasing = new DateTime(date.Year, date.Month, date.Day);

            var result = await _applicationContext.Organizations.FindAsync(1);
            if (status == true)
            {
                result.OpenStatus = true;
                await _applicationContext.SaveChangesAsync();
                return Ok(new JsonResult(new { message = "Pos is open now!", status = true }));
            }
            else
            {
                var orders = await _applicationContext.Orders.Where(q => q.OrderStatus < 4 && q.OrderDate.HasValue &&
               q.OrderDate.Value.Year == dateForComarasing.Year &&
               q.OrderDate.Value.Month == dateForComarasing.Month &&
               q.OrderDate.Value.Day == dateForComarasing.Day).ToListAsync();
                if (orders.Count > 0)
                {
                    return BadRequest(new JsonResult(new { message = "There are still unfinished orders" }));
                }
                result.OpenStatus = false;
                await _applicationContext.SaveChangesAsync();
                return Ok(new JsonResult(new { message = "Pos is closed now!", status = false }));
            }
        }

        [HttpGet("check-open-status")]
        public async Task<IActionResult> CheckOpenStatus()
        {
            var result = await _applicationContext.Organizations.FindAsync(1);
            if (result.OpenStatus == true)
            {
                return Ok(new JsonResult(new { message = true }));
            }
            else
            {
                return Ok(new JsonResult(new { message = false }));
            }
        }

        [Authorize(Roles = "Admin,POS")]
        [HttpGet("pos-closing-report/{date}")]
        public async Task<PosClosingReportDto> GetPosClosingReport(DateTime date)
        {
            DateTime dateForComarasing = new DateTime(date.Year, date.Month, date.Day);
            double? totalOrdersValue = 0;
            var currentDate = DateTime.UtcNow;
            var organization = await _applicationContext.Organizations.FindAsync(1);
            var finishedOrders = await _applicationContext.Orders
    .Where(q => q.OrderDate.HasValue &&
                q.OrderDate.Value.Year == dateForComarasing.Year &&
                q.OrderDate.Value.Month == dateForComarasing.Month &&
                q.OrderDate.Value.Day == dateForComarasing.Day &&
                q.OrderStatus == 4)
    .ToListAsync();
            var cancelledOrders = await _applicationContext.Orders
    .Where(q => q.OrderDate.HasValue &&
                q.OrderDate.Value.Year == dateForComarasing.Year &&
                q.OrderDate.Value.Month == dateForComarasing.Month &&
                q.OrderDate.Value.Day == dateForComarasing.Day &&
                q.OrderStatus == 5)
    .ToListAsync();
            if (0 == finishedOrders.Count && cancelledOrders.Count == 0)
            {
                return new PosClosingReportDto();
            }
            else
            {
                foreach (var order in finishedOrders)
                {
                    var orderProducts = await _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId).ToListAsync();
                    if (orderProducts.Count > 0)
                    {
                        foreach(var product in orderProducts)
                        {
                            totalOrdersValue += product.UnitPrice * product.Quantity;
                        }
                    }
                }


                var employeeDataList = new List<EmployeeOrdersDto>();
                var allEmployees = await _applicationContext.Employees.ToListAsync();
                if (allEmployees.Count > 0) {
                    foreach (var employee in allEmployees)
                    {
                        var takenOrders = await _applicationContext.Orders.Where(q => q.OrderDate.HasValue &&
                q.OrderDate.Value.Year == dateForComarasing.Year &&
                q.OrderDate.Value.Month == dateForComarasing.Month &&
                q.OrderDate.Value.Day == dateForComarasing.Day && q.TakenEmployeeId == employee.EmployeeId).ToListAsync();
                        var delieveredOrders = await _applicationContext.Orders.Where(q => q.OrderDate.HasValue &&
                q.OrderDate.Value.Year == dateForComarasing.Year &&
                q.OrderDate.Value.Month == dateForComarasing.Month &&
                q.OrderDate.Value.Day == dateForComarasing.Day && q.DeliveredEmployeeId == employee.EmployeeId).ToListAsync();

                        var employeeToAdd = new EmployeeOrdersDto
                        {
                            Name = employee.LastName + ' ' + employee.FirstName,
                            TakenOrders = takenOrders.Count,
                            DelieveredOrders = delieveredOrders.Count
                        };
                        employeeDataList.Add(employeeToAdd);
                    }  
                }

                var productsData = new List<ProductSellPerDayDto>();
                var allSelledProductPerDay = await _applicationContext.OrderProducts.Where(q => q.Order.OrderDate.HasValue &&
                q.Order.OrderDate.Value.Year == dateForComarasing.Year &&
                q.Order.OrderDate.Value.Month == dateForComarasing.Month &&
                q.Order.OrderDate.Value.Day == dateForComarasing.Day && q.Order.OrderStatus == 4).ToListAsync();
                if (allSelledProductPerDay.Count > 0) {
                    var allProducts = await _applicationContext.Products.Where(q=> q.AvailableForUser == true).ToListAsync();
                    foreach(var item in allProducts)
                    {
                        int? selledQuantity = 0;
                        double? selledValue = 0;
                        var productName = item.Name;
                        foreach (var product in allSelledProductPerDay)
                        {
                            if(product.ProductId == item.ProductId)
                            {
                                selledQuantity += product.Quantity;
                                selledValue += product.UnitPrice * product.Quantity;
                            }
                        }

                        var productToAdd = new ProductSellPerDayDto
                        {
                            name = productName,
                            selledQuantity = selledQuantity,
                            selledValue = selledValue,
                        };
                        if(selledQuantity > 0)
                        {
                        productsData.Add(productToAdd);

                        }
                    }

                    
                }


                var reportData = new PosClosingReportDto
                {
                    Name = organization.Name,
                    CreatedAt = DateTime.Now,
                    ForDay = date,
                    FinishedOrdersCounter = finishedOrders.Count,
                    CanceledOrdersCounter = cancelledOrders.Count,
                    TotalOrdersValue = totalOrdersValue,
                    EmployeesOrders = employeeDataList,
                    Products = productsData,
                };

                return reportData;
            }
        }

        [Authorize(Roles = "Admin,POS")]
        [HttpGet("pos-closing-fiscal-report")]
        public async Task<PosClosingFiscalReport> GetFiscalReportData()
        {
            var organizationDetails = await _applicationContext.Organizations.FindAsync(1);
            var date = DateTime.Now;
            DateTime dateForComarasing = new DateTime(date.Year, date.Month, date.Day);
            var finishedOrders = await _applicationContext.Orders.Where(q => q.OrderDate.HasValue &&
                q.OrderDate.Value.Year == dateForComarasing.Year &&
                q.OrderDate.Value.Month == dateForComarasing.Month &&
                q.OrderDate.Value.Day == dateForComarasing.Day && q.OrderStatus == 4).ToListAsync();
            if (finishedOrders.Count > 0) {
                double? totalOrdersValue9 = 0;
                double? totalOrdersValue19 = 0;
                foreach (var order in finishedOrders) {
                    var orderProducts = await _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId).ToListAsync();
                    if (orderProducts.Count > 0) {
                        foreach (var product in orderProducts) {
                            var productDetails = await _applicationContext.Products.Where(q => q.ProductId == product.ProductId).FirstOrDefaultAsync();
                            if (productDetails.Tva == 9) {
                                totalOrdersValue9 += product.UnitPrice * product.Quantity;
                            }
                            if (productDetails.Tva == 19)
                            {
                                totalOrdersValue19 += product.UnitPrice * product.Quantity;
                            }
                        }
                    }
                }

                var dataToReturn = new PosClosingFiscalReport
                {
                    CompanyName = organizationDetails.Name,
                    Adress = organizationDetails.Address,
                    City = organizationDetails.City,
                    CUI = organizationDetails.Cif,
                    CurrentDate = date,
                    FinishedOrdersCounter = finishedOrders.Count,
                    TotalOrdersValue = totalOrdersValue9 + totalOrdersValue19,
                    Total19Tva = totalOrdersValue19 * 0.19,
                    Total9Tva = totalOrdersValue9 * 0.09,
                };
                return dataToReturn;
            }
            else
            {
                return new PosClosingFiscalReport();
            }

        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("pos-closing-report-between-dates/{startDate}/{endDate}")]
        public async Task<PosClosingReportDto> GetPosClosingReport(DateTime startDate, DateTime endDate)
        {
            DateTime start = startDate.Date;
            DateTime end = endDate.Date.AddDays(1).AddTicks(-1); // Include the entire end date

            double? totalOrdersValue = 0;
            var currentDate = DateTime.UtcNow;
            var organization = await _applicationContext.Organizations.FindAsync(1);

            // Get all orders within the date range
            var orders = await _applicationContext.Orders
                .Where(q => q.OrderDate.HasValue &&
                            q.OrderDate.Value >= start &&
                            q.OrderDate.Value <= end)
                .ToListAsync();

            var finishedOrders = orders.Where(q => q.OrderStatus == 4).ToList();
            var cancelledOrders = orders.Where(q => q.OrderStatus == 5).ToList();

            if (!finishedOrders.Any() && !cancelledOrders.Any())
            {
                return new PosClosingReportDto();
            }

            var orderIds = finishedOrders.Select(o => o.OrderId).ToList();
            var orderProducts = await _applicationContext.OrderProducts
                .Where(q => orderIds.Contains(q.OrderId))
                .ToListAsync();

            foreach (var product in orderProducts)
            {
                totalOrdersValue += product.UnitPrice * product.Quantity;
            }

            var employees = await _applicationContext.Employees.ToListAsync();
            var employeeDataList = new List<EmployeeOrdersDto>();

            foreach (var employee in employees)
            {
                var takenOrdersCount = orders.Count(q => q.TakenEmployeeId == employee.EmployeeId);
                var deliveredOrdersCount = orders.Count(q => q.DeliveredEmployeeId == employee.EmployeeId);

                var employeeToAdd = new EmployeeOrdersDto
                {
                    Name = $"{employee.LastName} {employee.FirstName}",
                    TakenOrders = takenOrdersCount,
                    DelieveredOrders = deliveredOrdersCount
                };
                employeeDataList.Add(employeeToAdd);
            }

            var productsData = new List<ProductSellPerDayDto>();
            var products = await _applicationContext.Products.Where(q => q.AvailableForUser == true).ToListAsync();

            foreach (var product in products)
            {
                var soldProducts = orderProducts.Where(op => op.ProductId == product.ProductId).ToList();
                var soldQuantity = soldProducts.Sum(sp => sp.Quantity);
                var soldValue = soldProducts.Sum(sp => sp.UnitPrice * sp.Quantity);

                if (soldQuantity > 0)
                {
                    var productToAdd = new ProductSellPerDayDto
                    {
                        name = product.Name,
                        selledQuantity = soldQuantity,
                        selledValue = soldValue
                    };
                    productsData.Add(productToAdd);
                }
            }

            var reportData = new PosClosingReportDto
            {
                Name = organization.Name,
                CreatedAt = startDate,
                ForDay = endDate, // Use start date for report reference
                FinishedOrdersCounter = finishedOrders.Count,
                CanceledOrdersCounter = cancelledOrders.Count,
                TotalOrdersValue = totalOrdersValue,
                EmployeesOrders = employeeDataList,
                Products = productsData
            };

            return reportData;
        }
    }
    }


    

