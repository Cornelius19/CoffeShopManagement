import { Component, OnInit } from '@angular/core';
import { EmployeeOrderService } from '../../employeeModule/orders/employee-order.service';
import { ReservationsEmployeeService } from '../../employeeModule/reservations/reservations-employee.service';
import { GetReservation } from '../../shared/models/getReservation';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { SharedService } from '../../shared/shared.service';

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {
    constructor(private reservationService: ReservationsEmployeeService, private sharedService: SharedService) {}
    allReservations: GetReservation[] = [];
    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();
    faTrashCan = faTrashCan;

    ngOnInit(): void {
        this.getAllReservations();
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
    }

    getAllReservations() {
        this.reservationService.getAllReservations().subscribe({
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
                });
                console.log(this.allReservations);
                
                this.dtTrigger.next(null);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    deleteReservation(reservationId: number) {
        if (confirm('Are you sure you want to delete this reservation?')) {
            this.reservationService.deleteReservation(reservationId).subscribe({
                next: (response: any) => {
                    this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                },
                error: (error: any) => {
                    this.sharedService.showNotification(false, 'Error', error.error.value.message);
                },
            });
        }
    }
}
