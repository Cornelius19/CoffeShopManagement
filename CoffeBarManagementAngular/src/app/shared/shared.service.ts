import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './components/errors/models/notification/notification.component';
import { User } from './models/user';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    bsModalRef?: BsModalRef;
    posStatus?: boolean;

    constructor(private modalService: BsModalService, private http: HttpClient) {}

    showNotification(isSuccess: boolean, title: string, message: string) {
        const initialState: ModalOptions = {
            initialState: {
                isSuccess,
                title,
                message,
            },
        };
        this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
    }

    showNotificationAndReload(isSuccess: boolean, title: string, message: string, needToRefresh: boolean) {
        const initialState: ModalOptions = {
            initialState: {
                isSuccess,
                title,
                message,
                needToRefresh,
            },
        };
        this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
    }

    selectQuantity(isSuccess: boolean, title: string, message: string) {
        const initialState: ModalOptions = {
            initialState: {
                isSuccess,
                title,
                message,
            },
        };
        this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
    }

    getUserId() {
        const userDetails = localStorage.getItem(environment.userKey);
        if (userDetails) {
            const user: User = JSON.parse(userDetails);
            return user.userId;
        }
        return null;
    }

    getAllTables() {
        return this.http.get(`${environment.appUrl}/api/tables/get-all-tables`);
    }

    getOrderNote(orderId: number) {
        return this.http.get(`${environment.appUrl}/api/orders/get-order-note-data/${orderId}`);
    }
    getReceiptData(orderId: number) {
        return this.http.get(`${environment.appUrl}/api/orders/get-receipt-data/${orderId}`);
    }

    checkOrderStatus(orderId: number) {
        return this.http.get(`${environment.appUrl}/api/orders/check-order-status/${orderId}`);
    }

    checkPosStatus() {
        return this.http.get(`${environment.appUrl}/api/pos/check-open-status`);
    }

    checkStatus() {
        this.checkPosStatus().subscribe({
            next: (response: any) => {
                this.posStatus = response.value.message;
                //console.log(this.posStatus);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getClosePOSData(date: string) {
        return this.http.get(`${environment.appUrl}/api/pos/pos-closing-report/${date}`);
    }

    convertDateToYYMMDD(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    convertDateToDDMMYY(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    }

    convertDateToYYMMDDHHMMSS(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
    }
}
