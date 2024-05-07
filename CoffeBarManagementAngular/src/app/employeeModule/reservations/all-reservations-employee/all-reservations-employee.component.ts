import { Component, OnInit } from '@angular/core';
import { ReservationsEmployeeService } from '../reservations-employee.service';
import { GetReservation } from '../../../shared/models/getReservation';

@Component({
  selector: 'app-all-reservations-employee',
  templateUrl: './all-reservations-employee.component.html',
  styleUrl: './all-reservations-employee.component.css'
})
export class AllReservationsEmployeeComponent implements OnInit {

  constructor(private reservationEmployeeSevice: ReservationsEmployeeService){}
  
  allReservations : GetReservation[] = [];

  ngOnInit(): void {
    this.getAllReservations();
  }

  getAllReservations(){
    this.reservationEmployeeSevice.getAllReservations().subscribe({
      next: (response:any) => {
        this.allReservations = response;
      },
      error: error => {
        console.log(error);
      }
    })
  }


}
