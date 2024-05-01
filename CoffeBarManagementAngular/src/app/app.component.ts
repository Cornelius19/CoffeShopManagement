import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { OrdersService } from './orders/orders.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private accountService: AccountService,private ordersService: OrdersService){}
  
  
  ngOnInit(): void {
    //on refresh the page is gonna call the refresh jwtToken that is gonna be stored in localStorage
    this.refreshUser();
    this.ordersService.getCounter();
  }

  private refreshUser(){
    const jwt = this.accountService.getJWT();
    if(jwt){
      this.accountService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: _ => {
          this.accountService.logout();
        } 
      })
    }else{
      this.accountService.refreshUser(null).subscribe();
    }
    
  }
}
