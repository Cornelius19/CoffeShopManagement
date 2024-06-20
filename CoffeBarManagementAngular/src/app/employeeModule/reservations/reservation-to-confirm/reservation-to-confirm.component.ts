import { Component, OnInit } from '@angular/core';
import { ReservationsEmployeeService } from '../reservations-employee.service';
import { GetReservation } from '../../../shared/models/getReservation';
import { SharedService } from '../../../shared/shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reservation-to-confirm',
    templateUrl: './reservation-to-confirm.component.html',
    styleUrl: './reservation-to-confirm.component.css',
})
export class ReservationToConfirmComponent implements OnInit {
    constructor(private reservationEmployeeService: ReservationsEmployeeService, private sharedService: SharedService, private router: Router) {}

    reservationsToConfirm: GetReservation[] = [];

    ngOnInit(): void {
        this.getAllReservationsToConfirm();
    }

    confirmReservations(reservationId: number) {
        if (confirm('Are you sure about this?')) {
            this.reservationEmployeeService.confirmReservation(reservationId).subscribe({
                next: (response:any) => {
                    this.sharedService.showNotification(true, "Success", response.value.message);
                    window.location.reload();//for reloading the page
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }
    }

    getAllReservationsToConfirm() {
        this.reservationEmployeeService.getReservationsToConfirm().subscribe({
            next: (response: any[]) => {
                this.reservationsToConfirm = response.map((reservation) => {
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
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
