import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service';
import { GetReservation } from '../../shared/models/getReservation';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-future-reservations',
  templateUrl: './future-reservations.component.html',
  styleUrl: './future-reservations.component.css'
})
export class FutureReservationsComponent implements OnInit{
  
  constructor(private reservationService: ReservationsService,
    private sharedService: SharedService
  ){}

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


  cancelReservation(reservationId:number){
    const userId = this.sharedService.getUserId();
    if(userId){
      this.reservationService.cancelReservation(userId,reservationId).subscribe({
        next:(response:any) => {
          this.sharedService.showNotificationAndReload(true,'Success',response.value.message,true);
        },
        error: (e:any) => {
          this.sharedService.showNotification(false,'Error',e.error.value.message);
        }
      });

    }
  }

}
