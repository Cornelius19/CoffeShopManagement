import { Component, OnInit } from '@angular/core';
import { ReservationsEmployeeService } from '../reservations-employee.service';
import { GetReservation } from '../../../shared/models/getReservation';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-all-reservations-employee',
  templateUrl: './all-reservations-employee.component.html',
  styleUrl: './all-reservations-employee.component.css'
})
export class AllReservationsEmployeeComponent implements OnInit {

  constructor(private reservationEmployeeService: ReservationsEmployeeService,private sharedService: SharedService){}
  
  allReservations : GetReservation[] = [];

  ngOnInit(): void {
    this.getAllReservations();
  }

  getAllReservations(){
    this.reservationEmployeeService.getAllReservations().subscribe({
      next: (response:any[]) => {
        this.allReservations = response.map((reservation) => {
          return {
            reservationId: reservation.reservationId,
            reservationDate: new Date(reservation.reservationdate),
            guestNumber: reservation.guestNumber,
            firstName: reservation.firstName,
            lastName: reservation.lastName,
            phoneNumber: reservation.phoneNumber,
            reservationStatus: reservation.reservationStatus,
            duration: reservation.duration,
            tableNumber: reservation.tableNumber,
          }
        });
      },
      error: error => {
        console.log(error);
      }
    })
  }

  cancelReservation(reservationId: number){
    this.reservationEmployeeService.deleteReservation(reservationId).subscribe({
        next: (response:any) => {
            this.sharedService.showNotificationAndReload(true,'Reservation Cancelled',response.value.message,true);
        },
        error: e => {
            console.log(e);
        }
    });
}


}
