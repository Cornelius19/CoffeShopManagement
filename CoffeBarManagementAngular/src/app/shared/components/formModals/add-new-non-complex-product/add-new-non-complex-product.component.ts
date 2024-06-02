import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GetCategories } from '../../../models/getCategories';
import { MenuService } from '../../../../menu/menu.service';

@Component({
    selector: 'app-add-new-non-complex-product',
    templateUrl: './add-new-non-complex-product.component.html',
    styleUrl: './add-new-non-complex-product.component.css',
})
export class AddNewNonComplexProductComponent implements OnInit {
    constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder,private menuService: MenuService) {}

  
    public categoryList: GetCategories[] = [];
    newProductForm: FormGroup = new FormGroup({});
    isSuccess: boolean = true;
    title: string = '';
    message: string = '';
    isSubmitted: boolean = false;


    ngOnInit(): void {
      this.initializeForm();
      this.getCategories();
    }

    initializeForm(){
      this.newProductForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        unitPrice: ['', [Validators.required,Validators.min(0)]],
        unitMeasure: ['', [Validators.required]],
        availableForUser: ['', [Validators.required]],
        categoryId: ['', [Validators.required]],
        quantity: ['', [Validators.required,Validators.min(0)]],
        supplyCheck: ['', [Validators.required,Validators.min(0)]],
      })
    }

    createNewProduct(){
    this.isSubmitted = true;
      if(this.newProductForm.valid){
        console.log(this.newProductForm.value);
        
      }
    }
    getCategories() {
      this.menuService.getMenuCategories().subscribe({
          next: (response: any) => {
              this.categoryList = response;
          },
          error: (error) => {
              console.log(error);
          },
      });
  }
}
