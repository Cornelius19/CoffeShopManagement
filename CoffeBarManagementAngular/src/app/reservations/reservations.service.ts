import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../shared/models/user';
import { of } from 'rxjs';
import { CreateReservation } from '../shared/models/createReservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  getUserId() {
    const userDetails = localStorage.getItem(environment.userKey);
    if (userDetails) {
      const user: User = JSON.parse(userDetails);
      return user.userId;
    }
    return null;
  }

  cancelReservation(userId:number,reservationId:number){
   return this.http.delete(`${environment.appUrl}/api/reservations/delete-reservation/${userId}/${reservationId}`);
  }

  getReservations() {
    const userId = this.getUserId();
    if (userId) {
      return this.http.get<any>(
        `${environment.appUrl}/api/reservations/reservations-client/${userId}`
      );
    }
    return of(null);
  }

  createReservation(model: CreateReservation, userId: number) {
    return this.http.post(
      `${environment.appUrl}/api/reservations/create-reservation-client/${userId}`,
      model
    );
  }

  clearHistory(userId:number){
    return this.http.delete(`${environment.appUrl}/api/reservations/clear-reservations-history/${userId}`)
  }
}
