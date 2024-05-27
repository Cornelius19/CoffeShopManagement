import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeOrderService {

  constructor(private http:HttpClient ) { }

  getAllOrdersToConfirm(){
    return this.http.get<any>(`${environment.appUrl}/api/orders/get-orders-to-confirm`);
  }

  confirmOrder(userId: number, orderId: number){
    return this.http.put(`${environment.appUrl}/api/orders/confirm-order/${userId}/${orderId}`,null)
  }

  getActiveOrders(userId : number){
    return this.http.get<any>(`${environment.appUrl}/api/orders/get-employee-orders/${userId}`);
  }



}
