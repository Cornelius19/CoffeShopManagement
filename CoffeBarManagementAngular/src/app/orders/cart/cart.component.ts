import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrdersService } from '../orders.service';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  
  constructor(public ordersService : OrdersService){}
  
  public cartCounter: number = 0;


  ngOnInit(): void {
    this.ordersService.getTotalPrice();
    console.log(this.ordersService.cartList);
  }

}
