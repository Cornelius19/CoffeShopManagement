import { Component, OnInit } from '@angular/core';
import { EmployeeOrderService } from '../employee-order.service';
import { OrderDto } from '../../../shared/models/orderDto';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-orders-to-confirm',
  templateUrl: './orders-to-confirm.component.html',
  styleUrl: './orders-to-confirm.component.css'
})
export class OrdersToConfirmComponent implements OnInit {
  
  constructor(private employeeOrderService : EmployeeOrderService,
    private sharedService: SharedService
  ){}
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

  confirmOrder(orderId : number){
    if(confirm('Sure about this?')){
      const userId = this.sharedService.getUserId();
      if(userId){
        this.employeeOrderService.confirmOrder(userId,orderId).subscribe({
          next: (response:any) => {
            this.sharedService.showNotification(true,'Success',response.value.message);
            console.log(response);
          },
          error: error => {
            this.sharedService.showNotification(false,'Failed',error.value.value.message);
            console.log(error);
          }
        })

      }
    }
  }

  refuseOrder(id : number){

  }




}
