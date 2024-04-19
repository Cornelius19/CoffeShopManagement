import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Roles } from '../../dependencies/roles';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public accountService:AccountService, public roles: Roles){}

  logout(){
    this.accountService.logout();
  }
}
