import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateReservationEmployeeComponent } from './reservations/create-reservation-employee/create-reservation-employee.component';
import { ReservationToConfirmComponent } from './reservations/reservation-to-confirm/reservation-to-confirm.component';
import { FutureReservationsEmployeeComponent } from './reservations/future-reservations-employee/future-reservations-employee.component';
import { AllReservationsEmployeeComponent } from './reservations/all-reservations-employee/all-reservations-employee.component';
import { ActiveOrdersComponent } from './orders/active-orders/active-orders.component';
import { OrdersToConfirmComponent } from './orders/orders-to-confirm/orders-to-confirm.component';
import { PosComponent } from './pos/pos/pos.component';

const routes: Route[] = [
  {path: 'create-reservation', component:CreateReservationEmployeeComponent},
  {path: 'reservations-to-confirm', component:ReservationToConfirmComponent},
  {path: 'future-reservations', component:FutureReservationsEmployeeComponent},
  {path: 'all-reservations', component:AllReservationsEmployeeComponent},
  {path: 'active-orders', component:ActiveOrdersComponent},
  {path: 'orders-to-confirm', component:OrdersToConfirmComponent},
  {path: 'pos', component:PosComponent},

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
