import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateReservationEmployeeComponent } from './reservations/create-reservation-employee/create-reservation-employee.component';
import { ReservationToConfirmComponent } from './reservations/reservation-to-confirm/reservation-to-confirm.component';
import { FutureReservationsEmployeeComponent } from './reservations/future-reservations-employee/future-reservations-employee.component';
import { AllReservationsEmployeeComponent } from './reservations/all-reservations-employee/all-reservations-employee.component';
import { OrdersToConfirmComponent } from './orders/orders-to-confirm/orders-to-confirm.component';
import { PosComponent } from './pos/pos/pos.component';
import { TablesComponent } from './pos/tables/tables.component';
import { OrderDetailsComponent } from './pos/order-details/order-details.component';
import { PaymentComponent } from './pos/payment/payment.component';
import { StockBalanceComponent } from './stock-balance/stock-balance.component';
import { Roles } from '../../dependencies/roles';
import { RoleGuard } from '../shared/guards/authorization.guard';
import { AddStockProductsComponent } from './add-stock-products/add-stock-products.component';

const routes: Route[] = [
  {path: 'create-reservation', component:CreateReservationEmployeeComponent},
  {path: 'reservations-to-confirm', component:ReservationToConfirmComponent},
  {path: 'future-reservations', component:FutureReservationsEmployeeComponent},
  {path: 'all-reservations', component:AllReservationsEmployeeComponent},
  {path: 'orders-to-confirm', component:OrdersToConfirmComponent},
  {path: 'pos', component:PosComponent},
  {path: 'tables', component:TablesComponent},
  {path: 'payment', component:PaymentComponent},
  {path: 'order-details/:tableId', component:OrderDetailsComponent},
  {path: 'stock-balance', component: StockBalanceComponent,canActivate: [RoleGuard],
    data: { roles: [Roles.Pos,Roles.Admin] },},
    {path: 'add-stock-balance', component: AddStockProductsComponent,canActivate: [RoleGuard],
      data: { roles: [Roles.Pos,Roles.Admin] },}

] 

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class EmployeeRoutingModule { }
