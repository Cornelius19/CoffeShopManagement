import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/login';
import { User } from '../shared/models/user';
import { ReplaySubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  private userSource = new ReplaySubject<User | null>(1); //is an observabale that is gonna be either an user or an null
  user$ = this.userSource.asObservable();

  register(model: Register) {
    return this.http.post(`${environment.appUrl}/api/account/register`, model);
  }

  login(model: Login){
    return this.http.post<User>(`${environment.appUrl}/api/account/login`, model).pipe(
      map((user: User) => {
        if(user){
          this.setUser(user);
        }
      })
    )
  }

  private setUser(user: User){
    localStorage.setItem(environment.userKey, JSON.stringify(user));// we are storing the user inside local storage
    this.userSource.next(user)// we are store user information inside our angular application
  }
  
}
