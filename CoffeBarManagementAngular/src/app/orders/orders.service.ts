import { Injectable } from '@angular/core';
import { CartProduct } from '../shared/models/cartProduct';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { NewClientOrder } from '../shared/models/newClientOrder';
import { FinishOrderDto } from '../shared/models/finishOrderDto';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpClient) {}

    counter: number = 0;

    getCounter() {
        const counterString = localStorage.getItem(environment.counterKey);
        if (counterString) {
            this.counter = parseInt(counterString, 10);
        } else {
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
                console.error('It was a error trying to parse the localStorage item to the array!', error);
            }
        }
        return [];
    }

    updateCartCounter(list: CartProduct[]) {
        list = this.getCartItemsToList();
        if (list.length > 0) {
            const cartCounter: number = list.length;
            const cartCounterString = JSON.stringify(cartCounter);
            localStorage.setItem(environment.counterKey, cartCounterString);
        } else {
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

    getOrderHistory(userId: number) {
        return this.http.get(`${environment.appUrl}/api/orders/get-my-orders/${userId}`);
    }

    createNewClientOrder(model: NewClientOrder, userId: number, tableId: number) {
        return this.http.post(`${environment.appUrl}/api/orders/new-client-order/${userId}/${tableId}`, model);
    }

    getActiveOrder(userId: number) {
        return this.http.get(`${environment.appUrl}/api/orders/active-order/${userId}`);
    }

    addNewProductsToOrder(model: NewClientOrder, userId: number, orderId: number, tableId: number) {
        return this.http.post(`${environment.appUrl}/api/orders/add-new-product-to-order/${userId}/${orderId}/${tableId}`, model);
    }

    finishTheOrder(model: FinishOrderDto, userId: number, orderId: number) {
        return this.http.put(`${environment.appUrl}/api/orders/order-status-finished/${userId}/${orderId}`, model);
    }
}
