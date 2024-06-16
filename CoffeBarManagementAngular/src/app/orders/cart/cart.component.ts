import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { CartProduct } from '../../shared/models/cartProduct';
import { environment } from '../../../environments/environment.development';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
    constructor(public ordersService: OrdersService, public sharedService: SharedService,
private router: Router,
    ) {}

    public cartCounter: number = 0;
    public total: number = 0;
    modifiedQuantity = 0;

    cartList: CartProduct[] = this.ordersService.getCartItemsToList();


    ngOnInit(): void {
        this.totalPrice();
    }

    removeItem(id: number){
      if(confirm('You sure about removing this item from the cart?')){
        let newProductList : CartProduct[] = [];
        for(let item of this.cartList){
          if(item.productId != id){
            newProductList.push(item);
            localStorage.removeItem(environment.cartKey);
            localStorage.setItem(environment.cartKey, JSON.stringify(newProductList));
          }
        }
        if(newProductList.length == 0){
          localStorage.removeItem(environment.cartKey);
          localStorage.removeItem(environment.counterKey);
        }
        this.ordersService.updateCartCounter(newProductList);
        window.location.reload();
      }
    }


    changeQuantity(id: number) {
        if (this.modifiedQuantity <= 0 || this.modifiedQuantity > 20) {
            this.sharedService.showNotification(false, 'Error', 'Value must be greater than 0 and less than 21! ');
        } else {
            for (let i of this.cartList) {
                if (i.productId === id) {
                    i.quantity = this.modifiedQuantity;
                    i.total = i.unitPrice * i.quantity;
                    localStorage.removeItem(environment.cartKey);
                    localStorage.setItem(environment.cartKey, JSON.stringify(this.cartList));
                    this.total = 0;
                    this.totalPrice();
                    break;
                }
            }
        }
    }

    keyup(value: string) {
        const intValue = parseInt(value);
        this.modifiedQuantity = intValue;
    }

    totalPrice() {
        for (let item of this.cartList) {
            this.total = this.total + item.total;
        }
    }
}
