import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Roles } from '../../dependencies/roles';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(router: Router, accountService: AccountService, roles : Roles){
  }



}
