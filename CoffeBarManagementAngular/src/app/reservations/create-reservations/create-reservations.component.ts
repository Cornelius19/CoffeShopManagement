import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { __runInitializers } from 'tslib';
import { CreateReservation } from '../../shared/models/createReservation';
import { ReservationsService } from '../reservations.service';
import { SharedService } from '../../shared/shared.service';
import { GetTables } from '../../shared/models/getTables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-reservations',
  templateUrl: './create-reservations.component.html',
  styleUrl: './create-reservations.component.css',
})
export class CreateReservationsComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationsService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  reservationForm: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  public tableList: GetTables[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.getAllTables();
  }

  initializeForm() {
    this.reservationForm = this.formBuilder.group({
      guestNumber: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      tableNumber: ['', [Validators.required]],
      duration: [
        '',
        [Validators.required, Validators.min(1), Validators.max(4)],
      ],
      reservationDate: ['', [Validators.required]],
      reservationTime: ['', [Validators.required]],
    });
  }

  getAllTables() {
    this.reservationService.getAllTables().subscribe({
      next: (response: any) => {
        this.tableList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  createReservation() {
    this.isSubmitted = true;
    if (this.reservationForm.valid) {
      const reservationDate: Date = new Date(
        this.reservationForm.value.reservationDate
      );
      const reservationTime: string =
        this.reservationForm.value.reservationTime;

      // Format time as HH:MM:SS
      const timeParts: string[] = reservationTime.split(':');
      const hours: string = timeParts[0];
      const minutes: string = timeParts[1];
      const seconds: string = '00';

      // Format date as YYYY-MM-DD
      const year: number = reservationDate.getFullYear();
      const month: number = reservationDate.getMonth() + 1;
      const day: number = reservationDate.getDate();
      const dateString: string = `${year}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      // Combine date and time
      const datetimeString: string = `${dateString}T${hours}:${minutes}:${seconds}`;

      const model: CreateReservation = {
        reservationDate: datetimeString,
        guestNumber: this.reservationForm.value.guestNumber,
        duration: this.reservationForm.value.duration,
        tableId: this.reservationForm.value.tableNumber,
      };
      const userId = this.reservationService.getUserId();

      if (userId) {
        this.reservationService.createReservation(model, userId).subscribe({
          next: (response: any) => {
            this.sharedService.showNotification(
              true,
              response.value.title,
              response.value.message
            );
            this.router.navigateByUrl('/reservations/future-reservations');
          },
          error: (error) => {
            console.log(error);

            this.sharedService.showNotification(
              false,
              error.error.value.title,
              error.error.value.message
            );
          },
        });
      }
    }
    this.reservationForm.reset();
  }
}
