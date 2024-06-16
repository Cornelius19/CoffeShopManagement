import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './components/errors/models/notification/notification.component';
import { ModalModule } from 'ngx-bootstrap/modal';




@NgModule({
  declarations: [
    NotFoundComponent,
    NotificationComponent,
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
