import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { CartProduct } from '../../shared/models/cartProduct';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  constructor(public ordersService: OrdersService) {}

  public cartCounter: number = 0;
  public total: number = 0;

  cartList: CartProduct[] = this.ordersService.getCartItemsToList();

  ngOnInit(): void {
    this.totalPrice();
  }

  totalPrice(){
    for(let item of this.cartList){
      this.total = this.total + item.total;
    }
  }
}
