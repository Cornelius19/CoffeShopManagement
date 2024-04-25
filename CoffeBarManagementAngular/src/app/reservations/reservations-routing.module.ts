import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReservationsComponent } from './create-reservations/create-reservations.component';
import { AllReservationsComponent } from './all-reservations/all-reservations.component';
import { FutureReservationsComponent } from './future-reservations/future-reservations.component';

const routes: Routes = [
  {path:'', redirectTo: '/reservations/create-reservation',pathMatch:'full'},
  {path:'create-reservation',component:CreateReservationsComponent},
  {path:'all-reservations',component:AllReservationsComponent},
  {path:'future-reservations',component:FutureReservationsComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ReservationsRoutingModule { }
