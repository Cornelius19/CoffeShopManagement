import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service';
import { GetReservation } from '../../shared/models/getReservation';

@Component({
  selector: 'app-all-reservations',
  templateUrl: './all-reservations.component.html',
  styleUrl: './all-reservations.component.css',
})
export class AllReservationsComponent implements OnInit {
  
  constructor(private reservationService: ReservationsService) {}

  public allReservations: GetReservation[] = [];

  ngOnInit(): void {
    this.getReservationsbyId();
  }

  data: any[] = [];

  private getReservationsbyId() {
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
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
