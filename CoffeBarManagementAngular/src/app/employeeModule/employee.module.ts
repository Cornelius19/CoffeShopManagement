import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateReservationEmployeeComponent } from './reservations/create-reservation-employee/create-reservation-employee.component';
import { ReservationToConfirmComponent } from './reservations/reservation-to-confirm/reservation-to-confirm.component';
import { FutureReservationsEmployeeComponent } from './reservations/future-reservations-employee/future-reservations-employee.component';
import { AllReservationsEmployeeComponent } from './reservations/all-reservations-employee/all-reservations-employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActiveOrdersComponent } from './orders/active-orders/active-orders.component';
import { OrdersToConfirmComponent } from './orders/orders-to-confirm/orders-to-confirm.component';
import { PosComponent } from './pos/pos/pos.component';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        CreateReservationEmployeeComponent,
        ReservationToConfirmComponent,
        FutureReservationsEmployeeComponent,
        AllReservationsEmployeeComponent,
        ActiveOrdersComponent,
        OrdersToConfirmComponent,
        PosComponent,
    ],
    imports: [CommonModule, EmployeeRoutingModule, FormsModule, ReactiveFormsModule,DataTablesModule,FontAwesomeModule],
})
export class EmployeeModule {}
