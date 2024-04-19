import { Component, OnInit } from '@angular/core';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  constructor(private reservationService: ReservationService){}
  
  ngOnInit(): void {
    this.getReservationsbyId();
  }

  data: any[] = [];

  private getReservationsbyId(){
      this.reservationService.getReservations().subscribe({
        next: (response) => {
          console.log(response);
        },
        error: error => {
          console.log(error);
        }
      })
  }

}
