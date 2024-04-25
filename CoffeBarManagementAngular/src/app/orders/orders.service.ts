import { Injectable } from '@angular/core';
import { CartProduct } from '../shared/models/cartProduct';
import { GetProducts } from '../shared/models/getProducts';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  cartList: CartProduct[] = [];

  cartCounter: number = 0;

  totalPrice: number = 0;

  getTotalPrice(){
    if(this.cartList){
      for(let item of this.cartList)
        {
          this.totalPrice += item.total; 
        }
    }
  }

  updateCartCounter(){
    this.cartCounter = this.cartList.length;  
  }


  getCartProducts(){
    const cartProductsString = localStorage.getItem(environment.cartKey);
    if(cartProductsString){
    }
  }


  clearCart(){
    localStorage.removeItem(environment.cartKey);
  }
}
