using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Order;
using CoffeBarManagement.DTOs.Product;
using CoffeBarManagement.DTOs.StockBalance;
using CoffeBarManagement.Models.IdentityModels;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Drawing.Imaging;
using System.Numerics;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly Data.ApplicationContext _applicationContext;

        public OrdersController(Data.ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }

        // register the order with the initial products
        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpPost("new-client-order/{clientId}/{tableId}")]
        public async Task<IActionResult> NewClientOrder(ClientOrderDto model, int clientId, int tableId)
        {
            var notAddedProducts = new List<string>();
            var checkTableAvailability = await _applicationContext.Tables.FindAsync(tableId);
            if (checkTableAvailability.TableStatus == true) return BadRequest(new JsonResult(new { title = "Table occupied!", message = "This table is not availabale right now!" }));
            var unfinishedOrders = await _applicationContext.Orders.Where(q => q.ClientId == clientId).ToListAsync();
            foreach (var order in unfinishedOrders)
            {
                if (order.OrderStatus <= 3) return BadRequest(new JsonResult(new { title = "Unifinished order exist!", message = "An unfinished order exist for your account you can add new produts to that order or finish the previeous one!" }));
            }

            var orderToAdd = new Order
            {
                OrderDate = DateTime.Now,
                OrderStatus = 1,
                ClientId = clientId,
                TakenEmployeeId = null,
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
                if (productDetails == null)
                {
                    notAddedProducts.Add(productDetails.Name);
                    continue;
                }
                if (productDetails.ComplexProduct == false && productDetails.Quantity < product.quantity)
                {
                    notAddedProducts.Add(productDetails.Name);
                    continue;
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
                await _applicationContext.OrderProducts.AddAsync(orderProduct);
                await _applicationContext.SaveChangesAsync();
            }
            if (notAddedProducts.Count > 0)
            {
                return Ok(new JsonResult(new { title = "Order was succesfully registered but:", message = $"The next products {string.Join(", ", notAddedProducts)} cannot be added to the order because of the insuficient quantity" }));
            }

            return Ok(new JsonResult(new { title = "Order sent", message = "Order was succesfully registered, you can see it in active orders! :D" }));

        }


        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-orders-to-confirm")]
        public async Task<List<GetClientOrderDto>> GetClientOrders()
        {
            var orderList = new List<GetClientOrderDto>();
            var result = await _applicationContext.Orders.Where(q => q.OrderStatus == 1).ToListAsync();
            foreach (var order in result)
            {
                var employee = await _applicationContext.Employees.FindAsync(order.TakenEmployeeId);
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
            var result = await _applicationContext.Orders.Where(q => q.ClientId == id && (q.OrderStatus == 4 || q.OrderStatus == 5)).ToListAsync();
            foreach (var order in result)
            {
                var employee = await _applicationContext.Employees.FindAsync(order.TakenEmployeeId);
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
            if (order == null) return null;

            var employee = await _applicationContext.Employees.FindAsync(order.TakenEmployeeId);
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






        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpPost("add-new-product-to-order/{clientId}/{orderId}/{tableId}")]
        public async Task<IActionResult> AddNewProduct(ClientOrderDto model, int clientId, int orderId, int tableId)
        {
            var insufficientProducts = new List<string>();
            var CheckOrderExist = await _applicationContext.Orders.Where(q => q.OrderId == orderId & q.ClientId == clientId & q.OrderStatus <= 3).FirstOrDefaultAsync();
            if (CheckOrderExist == null) { return BadRequest(new JsonResult(new { message = "Such an order does not exist or it is not your order!" })); }
            if (CheckOrderExist.TableId != tableId) { return BadRequest(new JsonResult(new { message = "The table id is not the same!\nMake sure to scan the same qr code as for creating the order!"})); }
            CheckOrderExist.OrderStatus = 1;

            foreach (var product in model.Products)
            {
                var productDetails = await _applicationContext.Products.FindAsync(product.productId);
                if (productDetails == null)
                {
                    insufficientProducts.Add(productDetails.Name);
                    continue;
                }
                if (productDetails.ComplexProduct == false && productDetails.Quantity < product.quantity)
                {
                    insufficientProducts.Add(productDetails.Name);
                    continue;
                }
                var checkProductExistInOrder = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId && q.ProductId == product.productId).FirstOrDefaultAsync();
                if (checkProductExistInOrder == null)
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
            if (insufficientProducts.Count > 0)
            {
                return Ok(new JsonResult(new { title = "Well", message = $"The following products {string.Join(", ", insufficientProducts)} cannot be added to your order because they aren't availabale in that quantity!" }));
            }

            return Ok(new JsonResult(new { title = "Success", message = "The new products was added to your order!" }));
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("confirm-order/{employeeId}/{orderId}")]
        public async Task<IActionResult> ConfirmOrder(int employeeId, int orderId)
        {
            var result = await _applicationContext.Orders.FindAsync(orderId);
            if (result == null) return BadRequest(new JsonResult(new { message = "Such an order does not exist!" }));
            if (result.OrderStatus != 1)
            {
                return BadRequest(new JsonResult(new { message = "This order is already confirmed!" }));
            }

            result.OrderStatus += 1;
            result.TakenEmployeeId = employeeId;
            //var orderProducts = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId).ToListAsync();
            //foreach (var product in orderProducts)
            //{
            //    var productDetails = await _applicationContext.Products.FindAsync(product.ProductId);
            //    if (productDetails == null) { return BadRequest(new JsonResult(new { message = "Somthing went wrong!" })); }
            //    if (productDetails.ComplexProduct == false)
            //    {
            //        if (productDetails.Quantity < product.Quantity) return BadRequest(new JsonResult(new { message = $"We don't have so much {productDetails.Name}!" }));
            //        productDetails.Quantity -= product.Quantity;

            //        var stockBalanceRecord = new StockBalance
            //        {
            //            BalanceDate = DateTime.Now,
            //            ProductId = productDetails.ProductId,
            //            RemoveQuantity = product.Quantity,
            //            RemoveCategoryId = 1,
            //        };

            //        await _applicationContext.StockBalances.AddAsync(stockBalanceRecord);
            //        await _applicationContext.SaveChangesAsync();
            //    }
            //}
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new { message = "Order is confirmed!" }));
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPost("employee-create-order/{employeeId}/{payedStatus}")]
        public async Task<IActionResult> EmployeeCreateNewOrder(EmployeeOrderDto model, int employeeId, bool payedStatus)
        {
            int? finishEmployeeId = 0;
            var status = 2;
            if (payedStatus)
            {
                status = 4;
                finishEmployeeId = employeeId;
            }
            else
            {
                finishEmployeeId = null;
            }
            var notAddedProducts = new List<string>();
            var orderToAdd = new Order();
            var checkTableIdExist = await _applicationContext.Tables.FindAsync(model.TableId);
            if (checkTableIdExist != null)
            {
                if (checkTableIdExist.TableStatus == true) return BadRequest(new JsonResult(new { message = "This table is occupied right now!" }));
                orderToAdd = new Order
                {
                    OrderDate = DateTime.Now,
                    OrderStatus = status,
                    ClientId = null,
                    TakenEmployeeId = employeeId,
                    DeliveredEmployeeId = finishEmployeeId,
                    TableId = model.TableId,
                    Tips = 0,
                };
                if (status == 2) { checkTableIdExist.TableStatus = true; }
                await _applicationContext.Orders.AddAsync(orderToAdd);
                await _applicationContext.SaveChangesAsync();
            }
            else
            {
                orderToAdd = new Order
                {
                    OrderDate = DateTime.Now,
                    OrderStatus = status,
                    ClientId = null,
                    TakenEmployeeId = employeeId,
                    DeliveredEmployeeId = finishEmployeeId,
                    TableId = null,
                    Tips = 0,
                };
                await _applicationContext.Orders.AddAsync(orderToAdd);
                await _applicationContext.SaveChangesAsync();
            }
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
                if (productDetails == null)
                {
                    notAddedProducts.Add(productDetails.Name);
                    continue;
                }

                if (productDetails.ComplexProduct == false && productDetails.Quantity < product.quantity)
                {
                    notAddedProducts.Add(productDetails.Name);
                    continue;
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
                await _applicationContext.OrderProducts.AddAsync(orderProduct);
                await _applicationContext.SaveChangesAsync();
            }

            if (notAddedProducts.Count > 0)
            {
                return Ok(new JsonResult(new { title = "Order was succesfully registered but:", message = $"The next products {string.Join(", ", notAddedProducts)} cannot be added to the order because of the insuficient quantity", orderId = orderToAdd.OrderId }));
            }
            return Ok(new JsonResult(new { message = "A new order was created successfully!", orderId = orderToAdd.OrderId }));
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-employee-orders")]
        public async Task<List<GetOrderByTableDto>> GetEmployeeOrders()
        {
            //double total = 0;
            var orderList = new List<GetOrderByTableDto>();
            var result = await _applicationContext.Orders.Where(q => q.OrderStatus != 4 && q.OrderStatus != 5).ToListAsync();
            foreach (var order in result)
            {
                var takeEmployee = await _applicationContext.Employees.FindAsync(order.TakenEmployeeId);
                var finishEmployee = await _applicationContext.Employees.FindAsync(order.DeliveredEmployeeId);
                var clientDetails = await _applicationContext.Clients.FindAsync(order.ClientId);
                string clientName;
                if (clientDetails != null)
                {
                    clientName = clientDetails.LastName + ' ' + clientDetails.FirstName;
                }
                else
                {
                    clientName = " - ";
                }
                string employeeNameTake = string.Empty;
                string employeeNameFinish = string.Empty;
                if (takeEmployee != null)
                {
                    employeeNameTake = takeEmployee.FirstName;
                }
                else
                {
                    employeeNameTake = "";
                }
                if (finishEmployee != null)
                {
                    employeeNameFinish = finishEmployee.FirstName;
                }
                else
                {
                    employeeNameFinish = "";
                }
                var product = _applicationContext.OrderProducts.Where(q => q.OrderId == order.OrderId);
                var list = new List<OrderProductDto>();
                foreach (var item in product)
                {
                    var productName = await _applicationContext.Products.FindAsync(item.ProductId);
                    var productOrder = new OrderProductDto
                    {
                        productName = productName.Name,
                        unitPrice = item.UnitPrice,
                        quantity = item.Quantity,
                        productId = item.ProductId,
                        tva = productName.Tva,
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

                var activeOrder = new GetOrderByTableDto
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TableId = order.TableId,
                    TakeEmployeeName = employeeNameTake,
                    FinishEmployeeName = employeeNameFinish,
                    ClientName = clientName,
                    Status = statusName,
                    products = list,
                    //Total = total,
                };
                orderList.Add(activeOrder);
            }
            return orderList;
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("order-status-sent/{orderId}/{employeeId}")]
        public async Task<IActionResult> OrderSentStatus(int orderId, int employeeId)
        {
            var result = await _applicationContext.Orders.FindAsync(orderId);
            if (result == null) { return BadRequest("Such a order does not exist!"); }
            var employeeDetails = await _applicationContext.Employees.FindAsync(employeeId);
            if (employeeDetails == null) { return BadRequest(new JsonResult(new { message = "Employee data is invalid!" })); }
            if (result.OrderStatus != 2) { return BadRequest("The status for this order is already set to Delivered of finished or cancelled!"); }
            result.DeliveredEmployeeId = employeeId;
            result.OrderStatus = 3;

            await _applicationContext.SaveChangesAsync();

            return Ok("The order status was changed to delivered to the client!");
        }


        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpPut("order-status-finished/{userId}/{orderId}")]
        public async Task<IActionResult> OrderFinished(int userId, int orderId, FinishOrderDto model)
        {
            var orderToFinish = await _applicationContext.Orders.Where(q => q.ClientId == userId && q.OrderId == orderId).FirstOrDefaultAsync();
            if (orderToFinish == null) { return NotFound(); }
            var tableFromOrder = await _applicationContext.Tables.FindAsync(orderToFinish.TableId);
            if (tableFromOrder == null) { return NotFound("Don't know how this table was not found!"); }
            if (orderToFinish.OrderStatus != 3) return BadRequest(new JsonResult(new { title = "Order not delivered", message = "In order to finish this order, all products from the order must be delivered!" }));
            orderToFinish.OrderStatus = 4;
            orderToFinish.Tips = model.tips;
            tableFromOrder.TableStatus = false;
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new { message = "Order was finished successfuly!" }));

        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPost("add-new-product-to-order-employee/{orderId}")]
        public async Task<IActionResult> AddNewProductEmployee(ClientOrderDto model, int orderId)
        {
            var insufficientProducts = new List<string>();
            var CheckOrderExist = await _applicationContext.Orders.Where(q => q.OrderId == orderId & q.OrderStatus <= 3).FirstOrDefaultAsync();
            if (CheckOrderExist == null) { return BadRequest(new JsonResult(new { message = "Such an order does not exist or it is not your order!" })); }
            if (CheckOrderExist.OrderStatus == 1) return BadRequest((new JsonResult(new { message = "Before add some new products order must be confirmed!" })));
            CheckOrderExist.OrderStatus = 2;

            foreach (var product in model.Products)
            {
                var productDetails = await _applicationContext.Products.FindAsync(product.productId);
                if (productDetails == null)
                {
                    insufficientProducts.Add(productDetails.Name);
                    continue;
                }
                if (productDetails.ComplexProduct == false && productDetails.Quantity < product.quantity)
                {
                    insufficientProducts.Add(productDetails.Name);
                    continue;
                }
                var checkProductExistInOrder = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId && q.ProductId == product.productId).FirstOrDefaultAsync();
                if (checkProductExistInOrder == null)
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
            if (insufficientProducts.Count > 0)
            {
                return Ok(new JsonResult(new { message = $"The following products {string.Join(", ", insufficientProducts)} cannot be added to order because they aren't availabale in that quantity!" }));
            }

            return Ok(new JsonResult(new { message = "The new products was added to order!", products = model.Products }));
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("order-status-finished-employee/{orderId}/{tips}")]
        public async Task<IActionResult> FinishOrderEmployee(int orderId, float tips)
        {
            var orderToFinish = await _applicationContext.Orders.Where(q => q.OrderId == orderId).FirstOrDefaultAsync();
            if (orderToFinish == null) { return NotFound(); }
            var tableFromOrder = await _applicationContext.Tables.FindAsync(orderToFinish.TableId);
            if (tableFromOrder != null) { tableFromOrder.TableStatus = false; }
            if (orderToFinish.OrderStatus != 3) return BadRequest(new JsonResult(new { title = "Order not delivered", message = "In order to finish this order, all products from the order must be delivered!" }));
            orderToFinish.OrderStatus = 4;
            orderToFinish.Tips = tips;
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new { message = "Order was finished successfuly!" }));
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = "Employee,Client,POS")]
        [HttpGet("get-order-note-data/{orderId}")]
        public async Task<GetNoteDataDto> GetOrderNoteData(int orderId)
        {

            var organization = await _applicationContext.Organizations.FindAsync(1);
            var organizationName = organization.Name;
            var orderDetails = await _applicationContext.Orders.FindAsync(orderId);
            if (orderDetails == null) { return new GetNoteDataDto(); }

            var employeeName = string.Empty;
            var employeeDetails = await _applicationContext.Employees.FindAsync(orderDetails.TakenEmployeeId);
            if (employeeDetails != null)
            {
                employeeName = employeeDetails.FirstName + ' ' + employeeDetails.LastName;
            }

            string statusName = string.Empty;

            switch (orderDetails.OrderStatus)
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

            var orderProducts = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId).ToListAsync();

            double? totalPrice = 0;
            var noteProducts = new List<OrderProductInformationDto>();

            foreach (var item in orderProducts)
            {
                var productDetails = await _applicationContext.Products.FindAsync(item.ProductId);
                if (productDetails == null) { continue; }
                var productName = productDetails.Name;
                var productToAdd = new OrderProductInformationDto
                {
                    ProductName = productName,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                };
                totalPrice += item.UnitPrice * Convert.ToDouble(item.Quantity);
                noteProducts.Add(productToAdd);

            }
            var NoteData = new GetNoteDataDto
            {
                OrganizationName = organizationName,
                OrderDate = orderDetails.OrderDate,
                TableId = orderDetails.TableId,
                products = noteProducts,
                EmployeeName = employeeName,
                OrderId = orderId,
                OrderStatus = statusName,
                total = totalPrice,
            };
            return NoteData;
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-receipt-data/{orderId}")]
        public async Task<GetReceiptDataDto> GetReceiptData(int orderId)
        {
            var organizationData = await _applicationContext.Organizations.FindAsync(1);
            var orderDetails = await _applicationContext.Orders.FindAsync(orderId);
            var productsFromOrder = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId).ToListAsync();
            var productsList = new List<OrderProductDto>();
            foreach (var product in productsFromOrder)
            {
                var productNameDetails = await _applicationContext.Products.FindAsync(product.ProductId);
                var item = new OrderProductDto
                {
                    productName = productNameDetails.Name,
                    productId = product.ProductId,
                    unitPrice = product.UnitPrice,
                    tva = productNameDetails.Tva,
                    quantity = product.Quantity,
                };
                productsList.Add(item);
            }

            var receiptData = new GetReceiptDataDto
            {
                Name = organizationData.Name,
                adress = organizationData.Address,
                CIF = organizationData.Cif,
                City = organizationData.City,
                CreatedDate = DateTime.UtcNow,
                products = productsList
            };

            return receiptData;
        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = "Employee,Client,POS")]
        [HttpGet("check-order-status/{orderId}")]
        public async Task<IActionResult> CheckOrderStatus(int orderId)
        {
            var orderStatus = await _applicationContext.Orders.FindAsync(orderId);
            if (orderStatus == null)
            {
                return Ok(new JsonResult(new { status = 0 }));
            }
            else
            {
                return Ok(new JsonResult(new { status = orderStatus.OrderStatus }));
            }

        }

        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.POS_ROLE)]
        [HttpPut("order-status-cancel/{orderId}")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {

            var orderDetails = await _applicationContext.Orders.FindAsync(orderId);
            var tableDetails = await _applicationContext.Tables.FindAsync(orderDetails.TableId);
            if(orderDetails == null) return NotFound();
            orderDetails.OrderStatus = 5;
            if (tableDetails != null) { tableDetails.TableStatus = false; }
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new { message = "Order was canceled, please add back the cancelled quantities in stock! !" }));

        }


        [Authorize(Policy = "CheckOpenStatus")]
        [Authorize(Roles = Dependencis.POS_ROLE)]
        [HttpDelete("delete-order-product/{orderId}/{productId}")]
        public async Task<IActionResult> DeleteProductFromOrder(int productId, int orderId)
        {
            var productCheck = await _applicationContext.OrderProducts.Where(q => q.OrderId == orderId && q.ProductId == productId).ToListAsync();
            if (productCheck.Count > 0)
            {
                foreach(var product in productCheck)
                {
                    _applicationContext.OrderProducts.Remove(product);
                }
                await _applicationContext.SaveChangesAsync();
                return Ok(new JsonResult(new { message = "Product was deleted from order!" }));
            }
            return BadRequest(new JsonResult(new { message = "Somethin went wrong!" }));

        }
    }
}
