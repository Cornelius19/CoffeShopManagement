import { Component, OnInit } from '@angular/core';
import { ReservationService } from './reservation.service';
import { GetReservation } from '../shared/models/getReservation';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
new: any;
  
  constructor(private reservationService: ReservationService){}
  
  public allReservations : GetReservation[] = [];

  ngOnInit(): void {
    this.getReservationsbyId();
  }

  data: any[] = [];

  private getReservationsbyId(){
      this.reservationService.getReservations().subscribe({
        next: (response:any[]) => {
          this.allReservations = response.map(reservation => {
            return {
              reservationId: reservation.reservationId,
              reservationDate: new Date(reservation.reservationdate),
              guestNumber: reservation.guestNumber,
              firstName: reservation.firstName,
              lastName: reservation.lastName,
              phoneNumber: reservation.phoneNumber,
              reservationStatus: reservation.reservationStatus,
              duration: reservation.duration,
              tableNumber: reservation.tableNumber
            };
          });
          console.log(this.allReservations);
        },
        error: error => {
          console.log(error);
        }
      })
  }

}
