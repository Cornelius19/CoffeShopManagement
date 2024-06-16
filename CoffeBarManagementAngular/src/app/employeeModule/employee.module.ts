import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateReservationEmployeeComponent } from './reservations/create-reservation-employee/create-reservation-employee.component';
import { ReservationToConfirmComponent } from './reservations/reservation-to-confirm/reservation-to-confirm.component';
import { FutureReservationsEmployeeComponent } from './reservations/future-reservations-employee/future-reservations-employee.component';
import { AllReservationsEmployeeComponent } from './reservations/all-reservations-employee/all-reservations-employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersToConfirmComponent } from './orders/orders-to-confirm/orders-to-confirm.component';
import { PosComponent } from './pos/pos/pos.component';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TablesComponent } from './pos/tables/tables.component';
import { OrderDetailsComponent } from './pos/order-details/order-details.component';
import { PaymentComponent } from './pos/payment/payment.component';
import { StockBalanceComponent } from './stock-balance/stock-balance.component';
import { DeleteProductModalComponent } from './pos/modals/delete-product-modal/delete-product-modal.component';
import { AddStockProductsComponent } from './add-stock-products/add-stock-products.component';
@NgModule({
    declarations: [
        CreateReservationEmployeeComponent,
        ReservationToConfirmComponent,
        FutureReservationsEmployeeComponent,
        AllReservationsEmployeeComponent,
        OrdersToConfirmComponent,
        PosComponent,
        TablesComponent,
        OrderDetailsComponent,
        PaymentComponent,
        StockBalanceComponent,
        DeleteProductModalComponent,
        AddStockProductsComponent,
    ],
    imports: [CommonModule, EmployeeRoutingModule, FormsModule, ReactiveFormsModule, DataTablesModule, FontAwesomeModule, SharedModule],
})
export class EmployeeModule {}
