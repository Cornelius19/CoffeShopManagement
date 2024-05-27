import { Component, OnInit } from '@angular/core';
import { EmployeeOrderService } from '../employee-order.service';
import { SharedService } from '../../../shared/shared.service';
import { OrderDto } from '../../../shared/models/orderDto';

@Component({
  selector: 'app-active-orders',
  templateUrl: './active-orders.component.html',
  styleUrl: './active-orders.component.css'
})
export class ActiveOrdersComponent implements OnInit {
  
  public activeOrder : OrderDto[] = [];

  constructor(private employeeOrdersService: EmployeeOrderService,
    private sharedService: SharedService
  ){}

  ngOnInit(): void {
    this.getActiveOrders();
  }

  getActiveOrders(){
    const userId = this.sharedService.getUserId();
    if(userId){
      this.employeeOrdersService.getActiveOrders(userId).subscribe({
        next: (response:any[]) => {          
          this.activeOrder = response;
          console.log(this.activeOrder);
          
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }



}
