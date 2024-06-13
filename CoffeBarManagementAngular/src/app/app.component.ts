import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { OrdersService } from './orders/orders.service';
import { Roles } from '../dependencies/roles';
import { EmployeeOrderService } from './employeeModule/orders/employee-order.service';
import { environment } from '../environments/environment.development';
import { OrderDto } from './shared/models/orderDto';
import { IntervalFuntionsService } from './interval-funtions.service';
import { PosService } from './employeeModule/pos/pos.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
    title(title: any) {
        throw new Error('Method not implemented.');
    }

    constructor(
        public accountService: AccountService,
        private ordersService: OrdersService,
        public roles: Roles,
        private employeeOrderService: EmployeeOrderService,
        private intervalService: IntervalFuntionsService,
        private posService: PosService
    ) {}
    ngOnDestroy(): void {
        this.intervalService.stopPeriodicFunction();
    }

    ngOnInit(): void {
        //on refresh the page is gonna call the refresh jwtToken that is gonna be stored in localStorage
        this.refreshUser();
        this.ordersService.getCounter();
        if (
            this.accountService.user$ !== null &&
            (this.accountService.getUserRole() === this.roles.Employee1 || this.accountService.getUserRole() === this.roles.Pos1)
        ) {
            this.intervalService.startGettingAllOrders();
        }
        this.posService.setStatus();
    }

    private refreshUser() {
        const jwt = this.accountService.getJWT();
        if (jwt) {
            this.accountService.refreshUser(jwt).subscribe({
                next: (_) => {},
                error: (_) => {
                    this.accountService.logout();
                },
            });
        } else {
            this.accountService.refreshUser(null).subscribe();
        }
    }
}
