using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Order;
using CoffeBarManagement.DTOs.Product;
using CoffeBarManagement.DTOs.StockBalance;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;

        public OrdersController(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }

        // register the order with the initial products
        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpPost("new-client-order/{clientId}/{tableId}")]
        public async Task<IActionResult> NewClientOrder(ClientOrderDto model, int clientId, int tableId)
        {
            var notAddedProducts = new List<string>();
            var checkTableAvailability = await _applicationContext.Tables.FindAsync(tableId);
            if (checkTableAvailability.TableStatus == true) return BadRequest(new JsonResult(new  { title = "Table occupied!", message = "This table is not availabale right now!"}));
            var unfinishedOrders = await _applicationContext.Orders.Where(q => q.ClientId == clientId).ToListAsync();
            foreach (var order in unfinishedOrders)
            {
                if (order.OrderStatus <= 3 ) return BadRequest(new JsonResult(new { title = "Unifinished order exist!", message = "An unfinished order exist for your account you can add new produts to that order or finish the previeous one!" }));
            }

            var orderToAdd = new Order
            {
                OrderDate = DateTime.Now,
                OrderStatus = 1,
                ClientId = clientId,
                EmployeeId = null,
                TableId = tableId,
                Tips = 0,
            };

            checkTableAvailability.TableStatus = true;
            await _applicationContext.Orders.AddAsync(orderToAdd);
            await _applicationContext.SaveChangesAsync();

            foreach (var product in model.Products)
            {
                var orderProduct = new OrderProduct
                {
                    OrderId = orderToAdd.OrderId,
                    ProductId = product.productId,
                    UnitPrice = product.unitPrice,
                    Quantity = product.quantity,
                };
                var productDetails = await _applicationContext.Products.FindAsync(product.productId);
                if (productDetails == null) {
                    notAddedProducts.Add(productDetails.Name);
                    continue;
                }
                if (productDetails.ComplexProduct == false && productDetails.Quantity < product.quantity)
                {
                    notAddedProducts.Add(productDetails.Name);
                    continue;
                }
                if(productDetails.ComplexProduct == false)
                {
                    productDetails.Quantity -= product.quantity;
                    var stockBalanceRecord = new StockBalance
                    {
                        BalanceDate = DateTime.Now,
                        ProductId = productDetails.ProductId,
                        RemoveQuantity = product.quantity,
                        RemoveCategoryId = 1,
                    };
                    await _applicationContext.StockBalances.AddAsync(stockBalanceRecord);
                }
                await _applicationContext.OrderProducts.AddAsync(orderProduct);
                await _applicationContext.SaveChangesAsync();
            }
            if(notAddedProducts.Count > 0)
            {
                return Ok(new JsonResult(new {title = "Order was succesfully registered but:", message = $"The next products {string.Join(", ", notAddedProducts)} cannot be added to the order because of the insuficient quantity"}));
            }

            return Ok(new JsonResult(new {title = "Order sent", message = "Order was succesfully registered, you can see it in active orders! :D"}));

        }


        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-orders-to-confirm")]
        public async Task<List<GetClientOrderDto>> GetClientOrders()
        {
            var orderList = new List<GetClientOrderDto>();
            var result = await _applicationContext.Orders.Where(q => q.OrderStatus == 1).ToListAsync();
            foreach (var order in result)
            {
                var employee = await _applicationContext.Employees.FindAsync(order.EmployeeId);
                string employeeName = string.Empty;
                if (employee != null)
                {
                    employeeName = employee.FirstName;
                }
                else
                {
                    employeeName = "";
                }
                var product = _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId);
                var list = new List<OrderProductInformationDto>();
                foreach (var item in product)
                {
                    var productName = await _applicationContext.Products.FindAsync(item.ProductId);
                    var productOrder = new OrderProductInformationDto
                    {
                        ProductName = productName.Name,
                        UnitPrice = item.UnitPrice,
                        Quantity = item.Quantity,
                    };
                    list.Add(productOrder);
                }

                string statusName = string.Empty;

                switch (order.OrderStatus)
                {
                    case 1:
                        statusName = "Pending";
                        break;
                    case 2:
                        statusName = "Accepted";
                        break;
                    case 3:
                        statusName = "Delivered";
                        break;
                    case 4:
                        statusName = "Finished";
                        break;
                    case 5:
                        statusName = "Cancelled";
                        break;
                }

                var clientOrder = new GetClientOrderDto
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TableId = order.TableId,
                    EmployeeName = employeeName,
                    Status = statusName,
                    products = list,
                };
                orderList.Add(clientOrder);
            }
            return orderList;
        }



        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpGet("get-my-orders/{id}")]
        public async Task<List<GetClientOrderDto>> GetClientOrders(int id)
        {
            //double total = 0;
            var orderList = new List<GetClientOrderDto>();
            var result = await _applicationContext.Orders.Where(q => q.ClientId == id && (  q.OrderStatus == 4 || q.OrderStatus == 5)).ToListAsync();
            foreach (var order in result)
            {
                var employee = await _applicationContext.Employees.FindAsync(order.EmployeeId);
                string employeeName = string.Empty;
                if (employee != null)
                {
                    employeeName = employee.FirstName;
                }
                else
                {
                    employeeName = "";
                }
                var product = _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId);
                var list = new List<OrderProductInformationDto>();
                foreach (var item in product)
                {
                    var productName = await _applicationContext.Products.FindAsync(item.ProductId);
                    var productOrder = new OrderProductInformationDto
                    {
                        ProductName = productName.Name,
                        UnitPrice = item.UnitPrice,
                        Quantity = item.Quantity,
                    };
                    //total += (double)(item.UnitPrice * Convert.ToDouble(item.Quantity));
                    list.Add(productOrder);
                }

                string statusName = string.Empty;

                switch (order.OrderStatus)
                {
                    case 1:
                        statusName = "Pending";
                        break;
                    case 2:
                        statusName = "Accepted";
                        break;
                    case 3:
                        statusName = "Delivered";
                        break;
                    case 4:
                        statusName = "Finished";
                        break;
                    case 5:
                        statusName = "Cancelled";
                        break;
                }

                var clientOrder = new GetClientOrderDto
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TableId = order.TableId,
                    EmployeeName = employeeName,
                    Status = statusName,
                    products = list,
                    //Total = total,
                };
                orderList.Add(clientOrder);
            }
            return orderList;
        }


        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpGet("active-order/{clientId}")]
        public async Task<GetClientOrderDto> GetActiveOrder(int clientId)
        {
            var order = await _applicationContext.Orders.Where(q => q.ClientId == clientId && q.OrderStatus != 4 && q.OrderStatus != 5).FirstOrDefaultAsync();
            if(order == null) return null;

            var employee = await _applicationContext.Employees.FindAsync(order.EmployeeId);
            string employeeName = string.Empty;
            if (employee != null)
            {
                employeeName = employee.FirstName;
            }
            else
            {
                employeeName = "";
            }
            var product = _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId);
            var list = new List<OrderProductInformationDto>();
            foreach (var item in product)
            {
                var productName = await _applicationContext.Products.FindAsync(item.ProductId);
                var productOrder = new OrderProductInformationDto
                {
                    ProductName = productName.Name,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                };
                //total += (double)(item.UnitPrice * Convert.ToDouble(item.Quantity));
                list.Add(productOrder);
            }

            string statusName = string.Empty;

            switch (order.OrderStatus)
            {
                case 1:
                    statusName = "Pending";
                    break;
                case 2:
                    statusName = "Accepted";
                    break;
                case 3:
                    statusName = "Delivered";
                    break;
                case 4:
                    statusName = "Finished";
                    break;
                case 5:
                    statusName = "Cancelled";
                    break;
            }

            var clientOrder = new GetClientOrderDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                TableId = order.TableId,
                EmployeeName = employeeName,
                Status = statusName,
                products = list,
                //Total = total,
            };
            return clientOrder;
        }







        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpPost("add-new-product-to-order/{clientId}/{orderId}/{tableId}")]
        public async Task<IActionResult> AddNewProduct(ClientOrderDto model, int clientId, int orderId, int tableId)
        {
            var insufficientProducts = new List<string>();
            var CheckOrderExist = await _applicationContext.Orders.Where(q => q.OrderId == orderId & q.ClientId == clientId & q.OrderStatus <= 3).FirstOrDefaultAsync();
            if (CheckOrderExist == null) { return BadRequest(new JsonResult(new { message = "Such an order does not exist or it is not your order!" })); }
            if (CheckOrderExist.TableId != tableId) { return BadRequest("The table id is not the same!"); }
            CheckOrderExist.OrderStatus = 1;

            foreach (var product in model.Products)
            {
                var productDetails = await _applicationContext.Products.FindAsync(product.productId);
                if (productDetails == null) {
                    insufficientProducts.Add(productDetails.Name);
                    continue;
                }
                if(productDetails.ComplexProduct == false && productDetails.Quantity < product.quantity)
                {
                    insufficientProducts.Add(productDetails.Name);
                    continue;
                }
                var checkProductExistInOrder = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId  && q.ProductId == product.productId).FirstOrDefaultAsync();
                if(checkProductExistInOrder == null)
                {
                    var productToAdd = new OrderProduct
                    {
                        OrderId = orderId,
                        ProductId = product.productId,
                        Quantity = product.quantity,
                        UnitPrice = product.unitPrice,
                    };
                    await _applicationContext.OrderProducts.AddAsync(productToAdd);
                }
                else
                {
                    checkProductExistInOrder.Quantity += product.quantity;
                    await _applicationContext.SaveChangesAsync();
                }
                
                if (productDetails.ComplexProduct == false)
                {
                    productDetails.Quantity -= product.quantity;
                    var stockBalanceRecord = new StockBalance
                    {
                        BalanceDate = DateTime.Now,
                        ProductId = productDetails.ProductId,
                        RemoveQuantity = product.quantity,
                        RemoveCategoryId = 1,
                    };

                    await _applicationContext.StockBalances.AddAsync(stockBalanceRecord);
                }
                
                await _applicationContext.SaveChangesAsync();
            }
            if(insufficientProducts.Count > 0)
            {
                return Ok(new JsonResult(new { title = "Well", message = $"The following products {string.Join(", ",insufficientProducts)} cannot be added to your order because they aren't availabale in that quantity!" }));
            }

            return Ok(new JsonResult(new { title = "Success", message = "The new products was added to your order!" }));
        }

        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("confirm-order/{employeeId}/{orderId}")]
        public async Task<IActionResult> ConfirmOrder(int employeeId, int orderId)
        {
            var result = await _applicationContext.Orders.FindAsync(orderId);
            if (result == null) return BadRequest("Such an order does not exist!");
            if (result.OrderStatus != 1)
            {
                return BadRequest("This order is already confirmed!");
            }

            result.OrderStatus += 1;
            result.EmployeeId = employeeId;
            var orderProducts = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId).ToListAsync();
            foreach (var product in orderProducts)
            {
                var productDetails = await _applicationContext.Products.FindAsync(product.ProductId);
                if (productDetails == null) { return BadRequest("Somthing went wrong!"); }
                if (productDetails.ComplexProduct == false)
                {
                    if (productDetails.Quantity < product.Quantity) return BadRequest($"We don't have so much {productDetails.Name}!");
                    productDetails.Quantity -= product.Quantity;

                    var stockBalanceRecord = new StockBalance
                    {
                        BalanceDate = DateTime.Now,
                        ProductId = productDetails.ProductId,
                        RemoveQuantity = product.Quantity,
                        RemoveCategoryId = 1,
                    };

                    await _applicationContext.StockBalances.AddAsync(stockBalanceRecord);
                    await _applicationContext.SaveChangesAsync();
                }
            }
            return Ok("Order is confirmed!");
        }

        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPost("employee-create-order/{employeeId}")]
        public async Task<IActionResult> EmployeeCreateNewOrder(EmployeeOrderDto model, int employeeId)
        {
            var checkTableIdExist = await _applicationContext.Tables.FindAsync(model.TableId);
            if (checkTableIdExist == null) return BadRequest("Such a table is not registered!");
            if (checkTableIdExist.TableStatus == true) return BadRequest(new JsonResult(new { title = "Table occupied!", message = "This table is occupied right now!" })); 
            var orderToAdd = new Order
            {
                OrderDate = DateTime.Now,
                OrderStatus = 2,
                ClientId = null,
                EmployeeId = employeeId,
                TableId = model.TableId,
                Tips = 0,
            };
            checkTableIdExist.TableStatus = true;
            await _applicationContext.Orders.AddAsync(orderToAdd);
            await _applicationContext.SaveChangesAsync();
            foreach (var product in model.Products)
            {
                var productToAdd = new OrderProduct
                {
                    OrderId = orderToAdd.OrderId,
                    ProductId = product.productId,
                    UnitPrice = product.unitPrice,
                    Quantity = product.quantity,
                };
                var productInfo = await _applicationContext.Products.FindAsync(product.productId);
                if (productInfo == null) return BadRequest("Something went to the left!");
                if (productInfo.Quantity < product.quantity) return BadRequest($"We don't have so much {productInfo.Name}");
                productInfo.Quantity -= product.quantity;
                var stockBalanceRecord = new StockBalance
                {
                    BalanceDate = DateTime.Now,
                    ProductId = productInfo.ProductId,
                    RemoveQuantity = product.quantity,
                    RemoveCategoryId = 1,
                };
                await _applicationContext.OrderProducts.AddAsync(productToAdd);
                await _applicationContext.StockBalances.AddAsync(stockBalanceRecord);
                await _applicationContext.SaveChangesAsync();
            }

            return Ok("A new order was created successfully!");
        }


        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-employee-orders/{employeeid}")]
        public async Task<List<GetClientOrderDto>> GetEmployeeOrders(int employeeid)
        {
            //double total = 0;
            var orderList = new List<GetClientOrderDto>();
            var result = await _applicationContext.Orders.Where(q => q.EmployeeId == employeeid).ToListAsync();
            foreach (var order in result)
            {
                var employee = await _applicationContext.Employees.FindAsync(order.EmployeeId);
                string employeeName = string.Empty;
                if (employee != null)
                {
                    employeeName = employee.FirstName;
                }
                else
                {
                    employeeName = "";
                }
                var product = _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId);
                var list = new List<OrderProductInformationDto>();
                foreach (var item in product)
                {
                    var productName = await _applicationContext.Products.FindAsync(item.ProductId);
                    var productOrder = new OrderProductInformationDto
                    {
                        ProductName = productName.Name,
                        UnitPrice = item.UnitPrice,
                        Quantity = item.Quantity,
                    };
                    //total += (double)(item.UnitPrice * Convert.ToDouble(item.Quantity));
                    list.Add(productOrder);
                }

                string statusName = string.Empty;

                switch (order.OrderStatus)
                {
                    case 1:
                        statusName = "Pending";
                        break;
                    case 2:
                        statusName = "Accepted";
                        break;
                    case 3:
                        statusName = "Delivered";
                        break;
                    case 4:
                        statusName = "Finished";
                        break;
                    case 5:
                        statusName = "Cancelled";
                        break;
                }

                var clientOrder = new GetClientOrderDto
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TableId = order.TableId,
                    EmployeeName = employeeName,
                    Status = statusName,
                    products = list,
                    //Total = total,
                };
                orderList.Add(clientOrder);
            }
            return orderList;
        }

        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("order-status-sent/{orderId}")]
        public async Task<IActionResult> OrderSentStatus(int orderId)
        {
            var result = await _applicationContext.Orders.FindAsync(orderId);
            if (result == null) { return BadRequest("Such a order does not exist!"); }

            if (result.OrderStatus != 2) { return BadRequest("The status for this order is already set to Delivered of finished or cancelled!"); }

            result.OrderStatus = 3;

            await _applicationContext.SaveChangesAsync();

            return Ok("The order status was changed to delivered to the client!");
        }



        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpPut("order-status-finished/{userId}/{orderId}")]
        public async Task<IActionResult> OrderFinished(int userId, int orderId, FinishOrderDto model)
        {
            var orderToFinish = await _applicationContext.Orders.Where(q => q.ClientId == userId & q.OrderId == orderId).FirstOrDefaultAsync();
            if (orderToFinish == null) { return NotFound(); }
            var tableFromOrder = await _applicationContext.Tables.FindAsync(orderToFinish.TableId);
            if (tableFromOrder == null) { return NotFound("Don't know how this table was not found!"); }
            if (orderToFinish.OrderStatus != 3) return BadRequest(new JsonResult( new{ title = "Order not delivered", message = "In order to finish this order, all products from the order must be delivered!" }));
            orderToFinish.OrderStatus = 4;
            orderToFinish.Tips = model.Tips;
            tableFromOrder.TableStatus = false;
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new {message = "Order was finished successfuly!" }));

        }

        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPost("add-new-product-to-order-employee/{orderId}")]
        public async Task<IActionResult> AddNewProductEmployee(ClientOrderDto model ,int orderId)
        {
            var CheckOrderExist = await _applicationContext.Orders.Where(q => q.OrderId == orderId  & q.OrderStatus <= 3 & q.ClientId == null).FirstOrDefaultAsync();
            if (CheckOrderExist == null) { return BadRequest("Such an order does not exist or it is not your order!"); }
            if (CheckOrderExist.OrderStatus == 1) return BadRequest("Before add some new products order must be confirmed!");
            CheckOrderExist.OrderStatus = 2;

            foreach (var product in model.Products)
            {
                var productToAdd = new OrderProduct
                {
                    OrderId = orderId,
                    ProductId = product.productId,
                    Quantity = product.quantity,
                    UnitPrice = product.unitPrice,
                };
                var productDetails = await _applicationContext.Products.FindAsync(product.productId);
                if (productDetails == null) { return BadRequest("Something went to the left!"); }
                if (productDetails.Quantity < product.quantity) return BadRequest($"We don't have so much {productDetails.Name}!");
                if (productDetails.ComplexProduct == false)
                {
                    productDetails.Quantity -= product.quantity;
                    var stockBalanceRecord = new StockBalance
                    {
                        BalanceDate = DateTime.Now,
                        ProductId = productDetails.ProductId,
                        RemoveQuantity = product.quantity,
                        RemoveCategoryId = 1,
                    };

                    await _applicationContext.StockBalances.AddAsync(stockBalanceRecord);
                }
                await _applicationContext.OrderProducts.AddAsync(productToAdd);
                await _applicationContext.SaveChangesAsync();
            }

            return Ok("The new products was added to your order!");
        }

        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("order-status-finished-employee/{orderId}")]
        public async Task<IActionResult> FinishOrderEmployee(int orderId, FinishOrderDto model)
        {
            var orderToFinish = await _applicationContext.Orders.Where(q => q.OrderId == orderId).FirstOrDefaultAsync();
            if (orderToFinish == null) { return BadRequest("Such order does not exist!"); }
            var tableFromOrder = await _applicationContext.Tables.FindAsync(orderToFinish.TableId);
            if(tableFromOrder == null) { return NotFound("The table disapear from database!"); }
            if (orderToFinish.OrderStatus != 3) return BadRequest("In order to finish this order, all products from the order must be delivered!");
            orderToFinish.OrderStatus = 4;
            orderToFinish.Tips = model.Tips;
            tableFromOrder.TableStatus = false;
            await _applicationContext.SaveChangesAsync();
            return Ok("Order was finished successfuly!");

        }

    }
}
