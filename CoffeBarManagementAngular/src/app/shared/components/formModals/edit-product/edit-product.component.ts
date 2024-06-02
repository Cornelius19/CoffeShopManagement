import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MenuService } from '../../../../menu/menu.service';
import { GetCategories } from '../../../models/getCategories';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
    constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder,private menuService: MenuService) {}

  
    public categoryList: GetCategories[] = [];
    newProductForm: FormGroup = new FormGroup({});
    isSubmitted: boolean = false;

    productId:number = 0;
    name:string = '';
    unitPrice:number = 0;   
    unitMeasure:string= '';
    availableForUser:boolean = false;
    complexProduct:boolean = false;
    categoryId: number = 0;
    quantity:number = 0;
    supplyCheck:number = 0;

    ngOnInit(): void {
      this.initializeForm();
      this.getCategories();
    }

    initializeForm(){
      this.newProductForm = this.formBuilder.group({
        name: [this.name, [Validators.required]],
        unitPrice: [this.unitPrice, [Validators.required,Validators.min(0)]],
        unitMeasure: [this.unitMeasure, [Validators.required]],
        availableForUser: [this.availableForUser, [Validators.required]],
        categoryId: [this.categoryId, [Validators.required]],
        quantity: [this.quantity, [Validators.required,Validators.min(0)]],
        supplyCheck: [this.supplyCheck, [Validators.required,Validators.min(0)]],
      })
    }

    modifyProduct(){
      if(confirm('Are you sure you want to apply this changes?')){
        this.isSubmitted = true;
        if(this.newProductForm.valid){
          console.log(this.newProductForm.value);
          
        }
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
