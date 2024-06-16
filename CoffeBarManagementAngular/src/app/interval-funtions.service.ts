import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { OrderDto } from './shared/models/orderDto';
import { EmployeeOrderService } from './employeeModule/orders/employee-order.service';

@Injectable({
    providedIn: 'root',
})
export class IntervalFuntionsService {
    private intervalId: any;
    ordersToConfirm: OrderDto[] = [];

    constructor(private employeeOrderService: EmployeeOrderService) {}
    counter: number = 0;

    getCounter() {
        const counterString = localStorage.getItem(environment.ordersToConfirmCounter);
        if (counterString) {
            this.counter = parseInt(counterString, 10);
            //console.log(this.counter);
            
        } else {
            this.counter = 0;
            //console.log(this.counter);

        }
    }

    startPeriodicFunction(callback: () => void, intervalTime: number = 60000) {
        if (!this.intervalId) {
            this.intervalId = setInterval(callback, intervalTime);
        }
    }
    stopPeriodicFunction() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    isIntervalRunning(): boolean {
        return !!this.intervalId;
    }

    getAllOrdersToConfirm() {
        this.employeeOrderService.getAllOrdersToConfirm().subscribe({
            next: (response: any[]) => {
                this.ordersToConfirm = response.map((order) => {
                    return {
                        orderId: order.orderId,
                        orderDate: new Date(order.orderDate),
                        tableId: order.tableId,
                        employeeName: order.EmployeeName,
                        status: order.status,
                        products: order.products,
                    };
                });
                if (this.ordersToConfirm.length > 0) {
                    localStorage.setItem(environment.ordersToConfirmCounter, this.ordersToConfirm.length.toString());
                    this.getCounter();
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    startGettingAllOrders(): void {
        this.startPeriodicFunction(() => {
            this.getAllOrdersToConfirm();
        });
    }
}
