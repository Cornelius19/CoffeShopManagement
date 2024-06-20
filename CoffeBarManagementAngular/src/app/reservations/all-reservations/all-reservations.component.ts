import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service';
import { GetReservation } from '../../shared/models/getReservation';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-all-reservations',
  templateUrl: './all-reservations.component.html',
  styleUrl: './all-reservations.component.css',
})
export class AllReservationsComponent implements OnInit {
  
  constructor(private reservationService: ReservationsService,
    private sharedService: SharedService
  ) {}

  public allReservations: GetReservation[] = [];

  ngOnInit(): void {
    this.getReservationsById();
  }

  data: any[] = [];

  private getReservationsById() {
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

  clearHistory(){
    if(confirm('This will delete all reservations from the past!')){
      const userId = this.sharedService.getUserId();
      if(userId){
        this.reservationService.clearHistory(userId).subscribe({
          next:(response:any) => {
            this.sharedService.showNotificationAndReload(true,'Success',response.value.message,true);
          },
          error:(error:any) => {
            this.sharedService.showNotification(true,'Success',error.error.value.message);

          }
        });
      }
      else{
        this.sharedService.showNotification(false,'Error','We cannot identify you!');
      }
    }
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
