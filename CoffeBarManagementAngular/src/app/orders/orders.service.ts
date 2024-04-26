import { Injectable, createPlatformFactory } from '@angular/core';
import { CartProduct } from '../shared/models/cartProduct';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor() {}

  totalPrice: number = 0;
  counter:number = 0;

  getTotalPrice() {
    const cartList: CartProduct[] = this.getCartItemsToList()
    if (cartList) {
      for (let item of cartList) {
        this.totalPrice += item.total;
      }
    }
  }

  getCounter(){
    const counterString = localStorage.getItem(environment.counterKey);
    if(counterString){
      this.counter = parseInt(counterString,10)
    }else{
      this.counter = 0;
    }
  }

  getCartItemsToList() {
    let list: CartProduct[] = [];
    const storageList = localStorage.getItem(environment.cartKey);
    if (storageList) {
      try {
        list = JSON.parse(storageList);
        if (!Array.isArray(list)) {
          throw new Error('The parsed object is not an array!');
        }
        return list;
      } catch (error) {
        console.error(
          'It was a error trying to parse the localStorage item to the array!',
          error,
        );
      }
    }
    return [];
  }

  updateCartCounter(list: CartProduct[]) {
    list = this.getCartItemsToList();
    if(list.length > 0){
      const cartCounter: number = list.length;
      const cartCounterString = JSON.stringify(cartCounter);
      localStorage.setItem(environment.counterKey, cartCounterString);
    }else{
      localStorage.setItem(environment.counterKey, '0');
    }
  }

  addCartItemsToLocalStorage(list: CartProduct[]): void {
    const listToAdd = JSON.stringify(list);
    localStorage.setItem(environment.cartKey, listToAdd);
  }

  clearCart(): void {
    localStorage.removeItem(environment.counterKey);
    localStorage.removeItem(environment.cartKey);
  }
}
