import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddCategory } from '../../../shared/models/addCategory';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin-service.service';
import { GetCategories } from '../../../shared/models/getCategories';

@Component({
    selector: 'app-modify-product-category',
    templateUrl: './modify-product-category.component.html',
    styleUrl: './modify-product-category.component.css',
})
export class ModifyProductCategoryComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private adminService: AdminService,
        private sharedService: SharedService,
    ) {}
    categoryId: number = 0;
    categoryName: string = '';
    availableMenu: boolean = false;

    isSubmitted: boolean = false;
    formGroup: FormGroup = new FormGroup({});

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            categoryId: [this.categoryId, [Validators.required]],
            categoryName: [this.categoryName, [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
            availableMenu: [this.availableMenu, [Validators.required]],
        });
    }

    modifyCategory() {
        this.isSubmitted = true;
        if (this.formGroup.valid) {
            const categoryToModify: GetCategories = this.formGroup.value;
            console.log(categoryToModify);

            this.adminService.modifyProductCategory(categoryToModify).subscribe({
                next: (response: any) => {
                    this.bsModalRef.hide();
                    this.sharedService.showNotificationAndReload(true, 'Success', response.value.message,true);
                },
                error: (error: any) => {
                    this.bsModalRef.hide();
                    this.sharedService.showNotificationAndReload(false, 'Error', error.error.value.message,false);
                },
            });
        }
    }
}
