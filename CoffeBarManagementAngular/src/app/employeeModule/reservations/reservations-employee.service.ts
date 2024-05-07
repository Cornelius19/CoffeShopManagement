import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CreateReservationEmployee } from '../../shared/models/CreateReservationEmployee';

@Injectable({
    providedIn: 'root',
})
export class ReservationsEmployeeService {
    constructor(private http: HttpClient) {}

    getReservationsToConfirm() {
        return this.http.get<any>(`${environment.appUrl}/api/reservations/get-reservation-to-confirm`);
    }

    createReservationEmployee(model: CreateReservationEmployee) {
        return this.http.post(`${environment.appUrl}/api/reservations/create-reservation-employee`, model);
    }

    confirmReservation(reservationId: number) {
        return this.http.put(`${environment.appUrl}/api/reservations/confirm-reservation/${reservationId}`, null);
    }

    getFutureReservations(){
        return this.http.get<any>(`${environment.appUrl}/api/reservations/get-future-reservations`);
    }

    getAllReservations(){
        return this.http.get(`${environment.appUrl}/api/reservations/get-all-reservations-employee`);
    }
}
