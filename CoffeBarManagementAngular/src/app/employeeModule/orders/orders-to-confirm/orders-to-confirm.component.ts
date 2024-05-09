import { Component, OnInit } from '@angular/core';
import { EmployeeOrderService } from '../employee-order.service';
import { OrderDto } from '../../../shared/models/orderDto';

@Component({
  selector: 'app-orders-to-confirm',
  templateUrl: './orders-to-confirm.component.html',
  styleUrl: './orders-to-confirm.component.css'
})
export class OrdersToConfirmComponent implements OnInit {
  
  constructor(private employeeOrderService : EmployeeOrderService){}
  ordersToConfirm : OrderDto [] = [];



  ngOnInit(): void {
    this.getAllOrdersToConfirm();
  }

  getAllOrdersToConfirm(){
    this.employeeOrderService.getAllOrdersToConfirm().subscribe({
      next: (response:any[]) => {
        this.ordersToConfirm = response.map((order) => {
          return {
            orderId : order.orderId,
            orderDate: new Date(order.orderDate),
            tableId: order.tableId,
            employeeName: order.EmployeeName,
            status: order.status,
            products: order.products
          };
        });
        console.log(this.ordersToConfirm);
        
      },
      error: error => {
        console.log(error);
      }
    });
  }

  confirmOrder(){
    
  }




}
