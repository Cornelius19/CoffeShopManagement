import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './components/errors/models/notification/notification.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddNewNonComplexProductComponent } from './components/formModals/add-new-non-complex-product/add-new-non-complex-product.component';
import { EditProductComponent } from './components/formModals/edit-product/edit-product.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificationComponent,
    AddNewNonComplexProductComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),// it sets this module to the entire application
  ],
  exports:[
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class SharedModule { }
