import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
import { Roles } from '../../dependencies/roles';
import { OrdersService } from '../orders/orders.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
    constructor(public accountService: AccountService, public roles: Roles, public ordersService: OrdersService) {}

    ngOnInit(): void {
        this.ordersService.getCounter();
    }

    logout() {
        this.accountService.logout();
        this.ordersService.clearCart();
        this.ordersService.getCounter();
    }
}
