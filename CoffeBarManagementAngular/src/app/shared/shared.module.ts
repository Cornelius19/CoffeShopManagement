import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './components/errors/models/notification/notification.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from './components/errors/models/confirmation-modal/confirmation-modal.component';




@NgModule({
  declarations: [
    NotFoundComponent,
    NotificationComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),// it sets this module to the entire application
  ],
  exports:[
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ]
})
export class SharedModule { }
