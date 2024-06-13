import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
import { Roles } from '../../dependencies/roles';
import { OrdersService } from '../orders/orders.service';
import { environment } from '../../environments/environment.development';
import { EmployeeOrderService } from '../employeeModule/orders/employee-order.service';
import { IntervalFuntionsService } from '../interval-funtions.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
    constructor(public accountService: AccountService, public roles: Roles, public ordersService: OrdersService,public intervalService: IntervalFuntionsService) {}
    ngOnInit(): void {
        this.ordersService.getCounter();
    }

    logout() {
        this.accountService.logout();
        this.ordersService.clearCart();
        this.ordersService.getCounter();
        localStorage.removeItem(environment.orderID);
    }
}
