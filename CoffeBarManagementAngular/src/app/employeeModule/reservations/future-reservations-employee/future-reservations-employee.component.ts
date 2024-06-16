import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReservationsEmployeeService } from '../reservations-employee.service';
import { GetReservation } from '../../../shared/models/getReservation';
import { SharedService } from '../../../shared/shared.service';

@Component({
    selector: 'app-future-reservations-employee',
    templateUrl: './future-reservations-employee.component.html',
    styleUrl: './future-reservations-employee.component.css',
})
export class FutureReservationsEmployeeComponent implements OnInit {
    constructor(private reservationEmployeeService: ReservationsEmployeeService,private sharedService: SharedService) {}

    futureReservations: GetReservation[] = [];
    startDate?: string;

    ngOnInit(): void {
        this.getFutureReservations();
    }

    getFutureReservations() {
        let startDate: Date = new Date();
        if (this.startDate) {
            startDate = new Date(this.startDate);
        }
        startDate.setHours(0, 0, 0, 0);
        const endDate: Date = new Date(startDate.getTime());
        endDate.setDate(endDate.getDate() + 1);

        this.reservationEmployeeService.getFutureReservations().subscribe({
            next: (response: any[]) => {
                this.futureReservations = response.map((reservation) => {
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
                });
                this.futureReservations = this.futureReservations.filter((obj) => {
                    const objDate = new Date(obj.reservationDate);
                    return objDate >= startDate && objDate < endDate;
                });
            },
            error: (error) => {
                console.log(error);
            },
        });
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
