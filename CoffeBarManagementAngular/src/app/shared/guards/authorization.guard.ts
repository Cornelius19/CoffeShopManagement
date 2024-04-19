import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { EmptyError, Observable, map } from 'rxjs';
import { User } from '../models/user';
import { SharedService } from '../shared.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  constructor(private accountService : AccountService, private router : Router, private sharedService: SharedService){}


  // canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
  //   return this.accountService.user$.pipe(
  //     map((user:User | null) => {
  //       if(user){
  //         return true;
  //       }else{
  //         this.sharedService.showNotification(false,'Authorize page','You are not authorized, please log in!');
  //         this.router.navigate(['account/login'], {queryParams: {return: state.url}});
  //         return false;
  //       }
  //     })
  //   );
  // }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
    const requiredRoles = router.data['roles'] as Array<string>;
    const userRole = this.accountService.getUserRole();

    if(requiredRoles && userRole){
      if(this.checkRoles(userRole,requiredRoles)){
        return true;
      }else{
        this.sharedService.showNotification(false,'Restricted area','Try better if you want access this page!');
        this.router.navigate([''], {queryParams: {return: state.url}});
        return false;
      }
    }else {
      // User roles not available, handle accordingly
      this.sharedService.showNotification(false,'Restricted area','Try better if you want access this page!');
      this.router.navigate([''], {queryParams: {return: state.url}});
      return false;
    }
  }

  private checkRoles(userRole:string, requiredRoles:string[]) : boolean{
    for (const role of requiredRoles) {
      if (userRole === role) {
        return true;
      }
    }
    return false; // Return false only if no matching role is found
}
}