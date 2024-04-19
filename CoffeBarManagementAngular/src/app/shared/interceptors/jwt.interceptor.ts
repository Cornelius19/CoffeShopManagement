import { HttpHandler, HttpRequest, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { environment } from '../../../environments/environment.development';
import { User } from '../models/user';


@Injectable()
export class JwtInterceptor implements HttpInterceptor { 

    constructor(){}


    //for set headers for every api call to have the authorization header in case the user is logged in
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let JWT : string = '';
    const userDetails = localStorage.getItem(environment.userKey);
    if(userDetails){
      const user: User = JSON.parse(userDetails);
      JWT = user.jwt;
    }

    if(JWT){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${JWT}`
        }
      });
    }
    return next.handle(request)
  }
  

};
