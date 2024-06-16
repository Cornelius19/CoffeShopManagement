import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/login';
import { User } from '../shared/models/user';
import { ReplaySubject, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EmployeeOrderService } from '../employeeModule/orders/employee-order.service';
import { IntervalFuntionsService } from '../interval-funtions.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient, private router: Router,private intervalService: IntervalFuntionsService) {}

  private userSource = new ReplaySubject<User | null>(1); //is an observabale that is gonna be either an user or an null
  user$ = this.userSource.asObservable();

  


  refreshUser(jwt:string | null){
    if(jwt === null){
      this.userSource.next(null);
      return of(undefined);
    }
    // let headers = new HttpHeaders();
    // headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this.http.get<User>(`${environment.appUrl}/api/account/refresh-user-token`).pipe(
      map((user:User) => {
        if(user){
          this.setUser(user);
        }
      })
    )
  }


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

  logout(){
    localStorage.removeItem(environment.userKey);
    localStorage.clear()
    this.userSource.next(null);
    this.router.navigateByUrl('/');
    this.intervalService.stopPeriodicFunction();
  }


  getJWT(){
    const key = localStorage.getItem(environment.userKey);
    if(key){
      const user: User = JSON.parse(key); // get the object from the local storage
      return user.jwt;
    }
    return null;
  }


  // get the roles from the jwt token
  jwtHelper = new JwtHelperService();  

  getUserRole(): string {
    let JWT:string;
    const token = localStorage.getItem(environment.userKey);
    if (token) {
      const user: User = JSON.parse(token);
      if(user){
        JWT = user.jwt;
      }else{
        JWT = 'null';
      }
      const decodedToken = this.jwtHelper.decodeToken(JWT);
      return decodedToken.role;
    } else {
      return 'null';
    }
  }

  private setUser(user: User){
    localStorage.setItem(environment.userKey, JSON.stringify(user));// we are storing the user inside local storage
    this.userSource.next(user)// we are store user information inside our angular application
  }
  
}
