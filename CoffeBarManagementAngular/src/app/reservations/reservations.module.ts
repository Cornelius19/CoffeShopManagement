import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllReservationsComponent } from './all-reservations/all-reservations.component';
import { FutureReservationsComponent } from './future-reservations/future-reservations.component';
import { CreateReservationsComponent } from './create-reservations/create-reservations.component';
import { ReservationsRoutingModule } from './reservations-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AllReservationsComponent,
    FutureReservationsComponent,
    CreateReservationsComponent
  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ReservationsModule { }
