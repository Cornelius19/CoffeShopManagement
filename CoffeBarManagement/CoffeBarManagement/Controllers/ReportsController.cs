using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Order;
using CoffeBarManagement.DTOs.Product;
using CoffeBarManagement.DTOs.Report;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;
        public ReportsController(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }


        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("get-stock-products-report/{categoryId}")]
        public async Task<List<StockBalanceReportDto>> GetStockProductsReport(int categoryId)
        {
            var listToReturn = new List<StockBalanceReportDto>();
            if (categoryId != 0)
            {
                var products = await _applicationContext.Products.Where(q => q.CategoryId == categoryId && q.ComplexProduct == false).ToListAsync();
                if (products.Count > 0)
                {
                    foreach (var product in products)
                    {
                        var category = await _applicationContext.Categories.FindAsync(product.CategoryId);
                        var productToAdd = new StockBalanceReportDto
                        {
                            Name = product.Name,
                            Unit_price = product.UnitPrice,
                            CurrentStock = product.Quantity,
                            Tva = product.Tva,
                            CategoryName = category.CategoryName,
                            stockLimit = product.SupplyCheck,
                            uniteMeasure = product.UnitMeasure,

                        };
                        listToReturn.Add(productToAdd);
                    }
                    return listToReturn;
                }
            }
            else
            {
                var products = await _applicationContext.Products.Where(q => q.ComplexProduct == false).ToListAsync();
                if (products.Count > 0)
                {
                    foreach (var product in products)
                    {
                        var productToAdd = new StockBalanceReportDto
                        {
                            Name = product.Name,
                            Unit_price = product.UnitPrice,
                            CurrentStock = product.Quantity,
                            Tva = product.Tva,
                            CategoryName = "All",
                            stockLimit = product.SupplyCheck,
                            uniteMeasure = product.UnitMeasure,
                        };
                        listToReturn.Add(productToAdd);
                    }
                    return listToReturn;
                }
            }
            return listToReturn;
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("get-lowStock-products-report")]
        public async Task<List<GetMenuProductDto>> GetLowStockProducts()
        {
            var listToReturn = new List<GetMenuProductDto>();
            var result = await _applicationContext.Products.Where(q => q.Quantity < q.SupplyCheck && q.ComplexProduct == false).ToListAsync();
            if (result.Count > 0)
            {
                foreach (var product in result)
                {
                    listToReturn.Add(new GetMenuProductDto
                    {
                        ProductName = product.Name,
                        ProductAvailability = product.Quantity,
                        ProductSupplyCheck = product.SupplyCheck,
                    });
                }
                return listToReturn;
            }
            return listToReturn;
        }

        [Authorize(Roles = Dependencis.ADMIN_ROLE)]
        [HttpGet("get-orders-details/{startDate}/{endDate}")]
        public async Task<List<GetOrderDetails>> GetOrderDetails(DateTime startDate, DateTime endDate)
        {
            var orders = new List<Order>();
            if (startDate.Date == new DateTime(1900,01,01) && endDate.Date == new DateTime(1900,01,01))
            {
                orders = await _applicationContext.Orders.Where(q => q.OrderStatus > 3).ToListAsync();
            }
            else
            {
                DateTime start = startDate.Date;
                DateTime end = endDate.Date.AddDays(1).AddTicks(-1);
                orders = await _applicationContext.Orders.Where(q => q.OrderDate.HasValue && q.OrderDate.Value >= start && q.OrderDate <= end && q.OrderStatus > 3).ToListAsync();
            }
            var listToReturn = new List<GetOrderDetails>();
            if (orders.Count > 0)
            {
                foreach (var order in orders)
                {
                    var productsList = new List<OrderProductDto>();
                    var orderProducts = await _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId).ToListAsync();
                    if (orderProducts.Count > 0)
                    {
                        double? total = 0;
                        string status = "";
                        switch (order.OrderStatus)
                        {
                            case 4:
                                status = "Finished";
                                break;
                            case 5:
                                status = "Canceled";
                                break;
                        }
                        foreach (var product in orderProducts)
                        {
                            var productName = await _applicationContext.Products.FindAsync(product.ProductId);
                            var productToAdd = new OrderProductDto
                            {
                                productName = productName.Name,
                                unitPrice = product.UnitPrice,
                                quantity = product.Quantity,
                            };
                            productsList.Add(productToAdd);
                            total += product.Quantity * product.UnitPrice;
                        }
                        var ClientName = string.Empty;
                        var TakenEmployee = string.Empty;
                        var DelievereEmployee = string.Empty;
                        var clientName = await _applicationContext.Clients.FindAsync(order.ClientId);
                        if (clientName != null) { ClientName = clientName.LastName + " " + clientName.FirstName; }
                        var employeeTaken = await _applicationContext.Employees.FindAsync(order.TakenEmployeeId);
                        if (employeeTaken != null) { TakenEmployee = employeeTaken.LastName + " " + employeeTaken.FirstName; }

                        var employeeDelievered = await _applicationContext.Employees.FindAsync(order.DeliveredEmployeeId);
                        if (employeeDelievered != null) { DelievereEmployee = employeeDelievered.LastName + " " + employeeDelievered.FirstName; }


                        var orderToAdd = new GetOrderDetails
                        {
                            OrderId = order.OrderId,
                            OrderDate = order.OrderDate,
                            OrderStatus = status,
                            ClientName = ClientName,
                            TableId = order.TableId,
                            TakenBy = TakenEmployee,
                            DelieveredBy = DelievereEmployee,
                            OrderValue = total,
                            Products = productsList
                        };
                        listToReturn.Add(orderToAdd);
                    }

                }
                return listToReturn;
            }
            return listToReturn;


        }

    }



}
