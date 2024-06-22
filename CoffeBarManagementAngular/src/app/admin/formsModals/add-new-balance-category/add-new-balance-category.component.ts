import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddCategory } from '../../../shared/models/addCategory';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin-service.service';
import { AddBalanceCategory } from '../../../shared/models/addBalanceCategory';

@Component({
    selector: 'app-add-new-balance-category',
    templateUrl: './add-new-balance-category.component.html',
    styleUrl: './add-new-balance-category.component.css',
})
export class AddNewBalanceCategoryComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private adminService: AdminService,
        private sharedService: SharedService,
    ) {}
    isSubmitted: boolean = false;
    formGroup: FormGroup = new FormGroup({});

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            removeCategoryName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        });
    }

    addNewBalanceCategory() {
        this.isSubmitted = true;
        if (this.formGroup.valid) {
            const categoryToAdd: AddBalanceCategory = this.formGroup.value;
            this.adminService.addNewBalanceCategory(categoryToAdd).subscribe({
                next: (response: any) => {
                    this.bsModalRef.hide();
                    this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                },
                error: (error: any) => {
                    this.bsModalRef.hide();
                    this.sharedService.showNotification(false, 'Error', error.error.value.message);
                },
            });
        }
    }
}
