import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Roles } from '../../dependencies/roles';
import { CartComponent } from '../orders/cart/cart.component';
import { OrdersService } from '../orders/orders.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent{
  constructor(
    public accountService: AccountService,
    public roles: Roles,
    public ordersService: OrdersService,
  ) {}

  logout() {
    this.accountService.logout();
  }
}
