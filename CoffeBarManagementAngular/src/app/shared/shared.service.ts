import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './components/errors/models/notification/notification.component';
import { User } from './models/user';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AddNewNonComplexProductComponent } from './components/formModals/add-new-non-complex-product/add-new-non-complex-product.component';
import { EditProductComponent } from './components/formModals/edit-product/edit-product.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  bsModalRef?: BsModalRef;

  constructor(private modalService: BsModalService, private http: HttpClient) { }

  showNotification(isSuccess: boolean, title: string, message: string){
    const initialState: ModalOptions = {
      initialState: {
        isSuccess,
        title,
        message
      }
    };
    this.bsModalRef = this.modalService.show(NotificationComponent, initialState)
  }

  showModifyProduct(productId:number,name:string,unitPrice:number,unitMeasure:string,availableForUser:boolean,complexProduct:boolean,categoryId: number,
    quantity:number,supplyCheck:number){
      const initialState: ModalOptions = {
        initialState: {
          productId,
          name,
          unitPrice,
          unitMeasure,
          availableForUser,
          complexProduct,
          categoryId,
          quantity,
          supplyCheck
        }
      };
      this.bsModalRef = this.modalService.show(EditProductComponent, initialState)
    }

  showAddNewNonComplexProduct(){
    this.bsModalRef = this.modalService.show(AddNewNonComplexProductComponent)
  }

  selectQuantity(isSuccess: boolean, title: string, message: string){
    const initialState: ModalOptions = {
      initialState: {
        isSuccess,
        title,
        message
      }
    };
    this.bsModalRef = this.modalService.show(NotificationComponent, initialState)
  }

  
  getUserId() {
    const userDetails = localStorage.getItem(environment.userKey);
    if (userDetails) {
      const user: User = JSON.parse(userDetails);
      return user.userId;
    }
    return null;
  }

  getAllTables(){
    return this.http.get(`${environment.appUrl}/api/tables/get-all-tables`);
  }

}
