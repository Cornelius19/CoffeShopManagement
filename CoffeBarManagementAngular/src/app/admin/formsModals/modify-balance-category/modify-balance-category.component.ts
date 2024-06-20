import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddBalanceCategory } from '../../../shared/models/addBalanceCategory';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin-service.service';
import { BalanceCategories } from '../../../shared/models/balanceCategories';

@Component({
    selector: 'app-modify-balance-category',
    templateUrl: './modify-balance-category.component.html',
    styleUrl: './modify-balance-category.component.css',
})
export class ModifyBalanceCategoryComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private adminService: AdminService,
        private sharedService: SharedService,
    ) {}
    removeCategoryId: number = 0;
    removeCategoryName: string = '';
    stockBalances : [] = [];
    isSubmitted: boolean = false;
    formGroup: FormGroup = new FormGroup({});

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            removeCategoryId: [this.removeCategoryId],
            removeCategoryName: [this.removeCategoryName,[Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            stockBalances: [this.stockBalances]
        });
    }

    modifyBalanceCategory() {
        this.isSubmitted = true;
        if (this.formGroup.valid) {
            const categoryToModify: BalanceCategories = this.formGroup.value;
            console.log(categoryToModify);
            
            this.adminService.modifyBalanceCategory(categoryToModify).subscribe({
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
