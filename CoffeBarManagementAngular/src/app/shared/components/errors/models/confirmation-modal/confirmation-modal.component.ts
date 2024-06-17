import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  message: string = '';
  confirmed: boolean = false;

  constructor(public bsModalRef: BsModalRef) {}

  confirm(){
    this.confirmed = true;
    this.bsModalRef.hide();
  }

  cancel(){
    this.confirmed = false;
    this.bsModalRef.hide();
  }

}
