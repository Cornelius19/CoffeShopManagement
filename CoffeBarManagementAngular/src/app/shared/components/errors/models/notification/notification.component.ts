import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css',
})
export class NotificationComponent {
    isSuccess: boolean = true;
    title: string = '';
    message: string = '';
    needToRefresh: boolean = false;

    constructor(public bsModalRef: BsModalRef) {}

    closeModal(){
        this.bsModalRef.hide();
        location.reload();
    }

}
