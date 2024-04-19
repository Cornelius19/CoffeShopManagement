import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../shared/models/user';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }
  
  private getUserId(){
    const userDetails = localStorage.getItem(environment.userKey);
    if(userDetails){
      const user: User = JSON.parse(userDetails)
      return user.userId;
    }
    return null;
  }

  getReservations(){
    const userId = this.getUserId();
    if(userId){
      return this.http.get<any>(`${environment.appUrl}/api/reservations/reservations-client/${userId}`);
    }
    return of(null);
  }
}
