import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddCategory } from '../../../shared/models/addCategory';
import { AdminService } from '../../admin-service.service';
import { error } from 'jquery';
import { SharedService } from '../../../shared/shared.service';

@Component({
    selector: 'app-add-new-product-category',
    templateUrl: './add-new-product-category.component.html',
    styleUrl: './add-new-product-category.component.css',
})
export class AddNewProductCategoryComponent implements OnInit {
    constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder,private adminService: AdminService, private sharedService: SharedService) {}
    isSubmitted: boolean = false;
    formGroup: FormGroup = new FormGroup({});


    ngOnInit(): void {
      this.initializeForm();
    }


    initializeForm(){
      this.formGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        availableMenu: ['', [Validators.required]],
      });
    }

    addNewCategory(){
      this.isSubmitted = true;
      if(this.formGroup.valid){
        const categoryToAdd : AddCategory = this.formGroup.value;
        this.adminService.addNewCategory(categoryToAdd).subscribe({
          next: (response:any) => {
            this.bsModalRef.hide();
            this.sharedService.showNotificationAndReload(true,'Success',response.value.message,true);
          },
          error: (error:any) => {
            this.bsModalRef.hide();
            this.sharedService.showNotification(false,'Error',error.error.value.message);
          }
        });
      }
    }



}
