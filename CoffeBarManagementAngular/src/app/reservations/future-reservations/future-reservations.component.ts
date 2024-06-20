import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service';
import { GetReservation } from '../../shared/models/getReservation';

@Component({
  selector: 'app-future-reservations',
  templateUrl: './future-reservations.component.html',
  styleUrl: './future-reservations.component.css'
})
export class FutureReservationsComponent implements OnInit{
  
  constructor(private reservationService: ReservationsService){}

  public allReservations: GetReservation[] = [];

  ngOnInit(): void {
    this.getFutureReservations();
  }

  private getFutureReservations(){
    const presentDate: Date = new Date;
    this.reservationService.getReservations().subscribe({
      next: (response: any[]) => {
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
          };
        })
        .filter((reservation:GetReservation) => (reservation.reservationDate > presentDate) && (reservation.reservationDate.getTime() > presentDate.getTime())); // Filtering reservations with date greater than present date
        
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

}
