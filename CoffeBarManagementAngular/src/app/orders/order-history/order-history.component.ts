import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  
  constructor(private ordersService: OrdersService, private sharedService:SharedService){}


  ngOnInit(): void {
    this.getOrderHistory();
  }



  getOrderHistory(){
    const userId = this.sharedService.getUserId();
    if(userId){
      console.log(userId);
      
      this.ordersService.getOrderHistory(userId).subscribe({
        next: response => {
          console.log(response);
          
        },
        error: error => {
          console.log(error);
        }
      })
    }
    
  }


}
