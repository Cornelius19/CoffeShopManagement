import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { SharedService } from '../../shared/shared.service';
import { OrderDto } from '../../shared/models/orderDto';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
    constructor(private ordersService: OrdersService, private sharedService: SharedService) {}

    ngOnInit(): void {
        this.getOrderHistory();
    }

    orderHistory: OrderDto[] = [];

    getOrderHistory() {
        const userId = this.sharedService.getUserId();
        if (userId) {
            this.ordersService.getOrderHistory(userId).subscribe({
                next: (response: any) => {
                    this.orderHistory = response;
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }
    }
}
