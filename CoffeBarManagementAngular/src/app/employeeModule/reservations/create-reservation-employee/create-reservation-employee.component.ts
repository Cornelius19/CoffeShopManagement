import { Component, OnInit } from '@angular/core';
import { ReservationsEmployeeService } from '../reservations-employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/shared.service';
import { GetTables } from '../../../shared/models/getTables';
import { CreateReservationEmployee } from '../../../shared/models/CreateReservationEmployee';
import { ReservationTimeValidator } from '../../../shared/validators/reservationTime';

@Component({
    selector: 'app-create-reservation-employee',
    templateUrl: './create-reservation-employee.component.html',
    styleUrl: './create-reservation-employee.component.css',
})
export class CreateReservationEmployeeComponent implements OnInit {
    constructor(
        private reservationEmployeeService: ReservationsEmployeeService,
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
    ) {}

    isSubmitted: boolean = false;
    reservationForm: FormGroup = new FormGroup({});
    tableList: GetTables[] = [];

    ngOnInit(): void {
        this.initializeForm();
        this.setTables();
    }

    initializeForm() {
        this.reservationForm = this.formBuilder.group({
            reservationDate: ['', [Validators.required]],
            reservationTime: ['', [Validators.required, ReservationTimeValidator]],
            guestNumber: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
            duration: ['', [Validators.required, Validators.min(1), Validators.max(14)]],
            tableId: ['', [Validators.required]],
            firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            phoneNumber: ['', [Validators.required, Validators.pattern('^0[6-9][0-9]{8}$')]],
        });
    }

    createReservation() {
        this.isSubmitted = true;
        if (this.reservationForm.valid) {
            const reservationDate: Date = new Date(this.reservationForm.value.reservationDate);
            const reservationTime: string = this.reservationForm.value.reservationTime;

            // Format time as HH:MM:SS
            const timeParts: string[] = reservationTime.split(':');
            const hours: string = timeParts[0];
            const minutes: string = timeParts[1];
            const seconds: string = '00';

            // Format date as YYYY-MM-DD
            const year: number = reservationDate.getFullYear();
            const month: number = reservationDate.getMonth() + 1;
            const day: number = reservationDate.getDate();
            const dateString: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            // Combine date and time
            const dateTimeString: string = `${dateString}T${hours}:${minutes}:${seconds}`;

            const model: CreateReservationEmployee = {
                reservationDate: dateTimeString,
                guestNumber: this.reservationForm.value.guestNumber,
                duration: this.reservationForm.value.duration,
                tableId: this.reservationForm.value.tableId,
                firstName: this.reservationForm.value.firstName,
                lastName: this.reservationForm.value.lastName,
                phoneNumber: this.reservationForm.value.phoneNumber,
            };

            if (model) {
                this.reservationEmployeeService.createReservationEmployee(model).subscribe({
                    next: (response:any) => {
                        this.isSubmitted = false;
                        this.sharedService.showNotification(true, "Reservation created!", response.value.message);
                        this.initializeForm();
                    },
                    error: (error) => {
                        this.sharedService.showNotification(false, error.error.value.title, error.error.value.message);
                    },
                });
            }
        }
    }

    setTables() {
        this.sharedService.getAllTables().subscribe({
            next: (response: any) => {
                this.tableList = response;
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
