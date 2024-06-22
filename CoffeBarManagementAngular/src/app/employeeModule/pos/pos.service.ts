import { Injectable } from '@angular/core';
import { CartProduct } from '../../shared/models/cartProduct';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GetTables } from '../../shared/models/getTables';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateEmployeeOrder } from '../../shared/models/createEmployeeOrderDto';
import { OrderProductsClient } from '../../shared/models/orderProductsClient';
import { NewClientOrder } from '../../shared/models/newClientOrder';
import { DeleteProductModalComponent } from './modals/delete-product-modal/delete-product-modal.component';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { EmailValidator } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class PosService {
    constructor(private http: HttpClient, private modalService: BsModalService, private sharedService: SharedService) {}

    bsModalRef?: BsModalRef;

    getCartProductsToList() {
        let list: CartProduct[] = [];
        const storageList = localStorage.getItem(environment.cartKey);
        if (storageList) {
            list = JSON.parse(storageList);
            return list;
        }
        return list;
    }

    getModifyCartProductsToList() {
        let list: CartProduct[] = [];
        const storageList = localStorage.getItem(environment.modifyCartProducts);
        if (storageList) {
            list = JSON.parse(storageList);
            return list;
        }
        return list;
    }

    addCartItemsToLocalStorage(list: CartProduct[]) {
        const listToAdd = JSON.stringify(list);
        localStorage.setItem(environment.cartKey, listToAdd);
    }

    addModifyCartItemsToLocalStorage(list: CartProduct[]) {
        const listToAdd = JSON.stringify(list);
        localStorage.setItem(environment.modifyCartProducts, listToAdd);
    }

    getAllProducts() {
        return this.http.get(`${environment.appUrl}/api/products/get-menu-allProducts`);
    }

    changeTableStatus(model: GetTables) {
        return this.http.put(`${environment.appUrl}/api/tables/change-table-status`, model);
    }

    createOrderEmployee(model: CreateEmployeeOrder, userId: number, payedStatus: boolean) {
        return this.http.post(`${environment.appUrl}/api/orders/employee-create-order/${userId}/${payedStatus}`, model);
    }

    getTableOrderDetails(tableId: number) {
        return this.http.get<any>(`${environment.appUrl}/api/orders/get-active-order-byTable/${tableId}`);
    }

    changeStatusToDelivered(orderId: number, employeeId: number) {
        return this.http.put(`${environment.appUrl}/api/orders/order-status-sent/${orderId}/${employeeId}`, null);
    }

    changeStatusToFinished(employeeId: number, tips: number) {
        return this.http.put(`${environment.appUrl}/api/orders/order-status-finished-employee/${employeeId}/${tips}`, null);
    }

    addNewProductsToOrder(orderId: number, model: NewClientOrder) {
        return this.http.post(`${environment.appUrl}/api/orders/add-new-product-to-order-employee/${orderId}`, model);
    }

    changeOpenStatus(status: boolean) {
        return this.http.put(`${environment.appUrl}/api/pos/change-status-pos/${status}`, null);
    }

    showDeleteProductModal(orderId: number) {
        const initialState: ModalOptions = {
            initialState: {
                orderId,
            },
        };
        this.bsModalRef = this.modalService.show(DeleteProductModalComponent, initialState);
    }

    cancelOrder(orderId: number) {
        return this.http.put(`${environment.appUrl}/api/orders/order-status-cancel/${orderId}`, null);
    }

    deleteProductFromOrder(orderId: number, productId: number) {
        return this.http.delete(`${environment.appUrl}/api/orders/delete-order-product/${orderId}/${productId}`);
    }

    getAllProductStockBalance() {
        return this.http.get(`${environment.appUrl}/api/products/get-all-products-stockbalance`);
    }

    addNewBalanceRecord(productId: number, categoryId: number, quantity: number) {
        return this.http.post(`${environment.appUrl}/api/pos/new-balace-record/${productId}/${categoryId}/${quantity}`, null);
    }

    cancelOrderById(orderId: number) {
        if (confirm('Are you sure about this?')) {
            if (orderId != 0) {
                this.cancelOrder(orderId).subscribe({
                    next: (response: any) => {
                        this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                        localStorage.removeItem(environment.ordersToConfirmCounter);
                    },
                    error: (e) => {
                        console.log(e);
                    },
                });
            }
        }
    }

    addStockQuantity(list: Object[]) {
        return this.http.post(`${environment.appUrl}/api/products/add-stock-quantity`, list);
    }

    getPosCloseFiscalReport() {
        return this.http.get(`${environment.appUrl}/api/pos/pos-closing-fiscal-report`);
    }

    changeStatusToAccepted(id:number){
        return this.http.put(`${environment.appUrl}/api/orders/status-accepted-order/${id}`,null);
    }
}
