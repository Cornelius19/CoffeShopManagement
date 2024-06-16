import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { SharedService } from '../../shared/shared.service';
import { OrderDto } from '../../shared/models/orderDto';
import { environment } from '../../../environments/environment.development';
import { toArray } from 'rxjs';
import { FinishOrderDto } from '../../shared/models/finishOrderDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-order',
  templateUrl: './active-order.component.html',
  styleUrl: './active-order.component.css'
})
export class ActiveOrderComponent implements OnInit {
  
  constructor(private ordersService: OrdersService,
    public sharedService: SharedService,
    private router: Router
  ){}
  
  activeOrder! : OrderDto; 
  total: number = 0;
  finalTotal:number = 0;
  

  ngOnInit(): void {
    this.getActiveOrder();
  }

  tips:number = 0;


  //one way data binding
  keyup(value:string){
    this.tips = parseFloat(value);
    if(value != ''){
      this.finalTotal = this.total + this.tips;
    }else{
      this.finalTotal = this.total;
    }
  }


  pay(){
    if(this.activeOrder){
      const orderId = this.activeOrder.orderId;
      const userId = this.sharedService.getUserId();
      if(userId){
        const tips:FinishOrderDto = {
          tips:this.tips
        }
        if(confirm('Are you sure about this?')){
          this.ordersService.finishTheOrder(tips,userId,orderId).subscribe({
            next: (response:any) => {
              //console.log(response);
              this.router.navigateByUrl('/orders/payment-page');
              this.sharedService.showNotification(true, 'Success!', response.value.message);
              localStorage.removeItem(environment.orderID);
            },
            error: error => {
              //console.log(error);
              this.sharedService.showNotification(false, error.error.value.title, error.error.value.message);
            }
          })
        }
      }
    }
    
  }

  getActiveOrder(){
    const userId = this.sharedService.getUserId();
    let total: number = 0;
    if(userId){
      this.ordersService.getActiveOrder(userId).subscribe({
        next: (response: any) => {
          //console.log(response);
          this.activeOrder = response;
          if(this.activeOrder){
            for(let i of this.activeOrder.products){
              total = total + (i.quantity * i.unitPrice);
            }
            this.total = total;
            this.finalTotal = total;
            localStorage.setItem(environment.orderID, `${this.activeOrder.orderId}`);
          }
          
          //console.log(this.activeOrder);
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }

}
