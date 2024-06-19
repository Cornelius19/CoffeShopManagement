import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddBalanceCategory } from '../../../shared/models/addBalanceCategory';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin-service.service';

@Component({
    selector: 'app-add-table',
    templateUrl: './add-table.component.html',
    styleUrl: './add-table.component.css',
})
export class AddTableComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private adminService: AdminService,
        private sharedService: SharedService,
    ) {}
    isSubmitted: boolean = false;
    formGroup: FormGroup = new FormGroup({});
    capacity: number = {} as number;
    modifyStatus: boolean = false;
    tableId:number = 0;

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        if (this.modifyStatus) {
            this.formGroup = this.formBuilder.group({
                capacity: [this.capacity, [Validators.required]],
            });
        } else {
            this.formGroup = this.formBuilder.group({
                capacity: ['', [Validators.required]],
            });
        }
    }

    

    addNewTable(tableId: number) {
        this.isSubmitted = true;
        if (this.formGroup.valid) {
            if (this.modifyStatus == false) {
                const model: Object = this.formGroup.value;
                this.adminService.addNewTable(model).subscribe({
                    next: (response: any) => {
                        this.bsModalRef.hide();
                        this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                    },
                    error: (error: any) => {
                        this.bsModalRef.hide();
                        this.sharedService.showNotification(false, 'Error', error.error.value.message);
                    },
                });
            } else {
                const model: Object = this.formGroup.value;
                this.adminService.modifyTableCapacity(tableId, model).subscribe({
                    next: (response: any) => {
                      this.bsModalRef.hide();
                        this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                    },
                    error: (e) => {
                        console.log(e);
                    },
                });
            }
        }
    }
}
