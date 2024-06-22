import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MenuService } from '../../../menu/menu.service';
import { GetCategories } from '../../../shared/models/getCategories';
import { AdminService } from '../../admin-service.service';
import { StockProducts } from '../../../shared/models/stockProducts';
import { SharedService } from '../../../shared/shared.service';

@Component({
    selector: 'app-add-new-non-complex-product',
    templateUrl: './add-new-non-complex-product.component.html',
    styleUrl: './add-new-non-complex-product.component.css',
})
export class AddNewNonComplexProductComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private adminService: AdminService,
        private sharedService: SharedService,
    ) {}

    public categoryList: GetCategories[] = [];
    newProductForm: FormGroup = new FormGroup({});
    isSubmitted: boolean = false;

    ngOnInit(): void {
        this.initializeForm();
        this.getCategories();
    }

    initializeForm() {
        this.newProductForm = this.formBuilder.group({
            name: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
            unitPrice: ['', [Validators.required, Validators.min(0)]],
            unitMeasure: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
            availableForUser: ['', [Validators.required]],
            categoryId: ['', [Validators.required]],
            quantity: ['', [Validators.required, Validators.min(0)]],
            supplyCheck: ['', [Validators.required, Validators.min(0)]],
            tva: ['', [Validators.required, Validators.min(0)]],
        });
    }

    getCategories() {
        this.menuService.getAllCategories().subscribe({
            next: (response: any) => {
                this.categoryList = response;
            },
            error: (error: any) => {
                console.log(error);
            },
        });
    }

    createNewProduct() {
        this.isSubmitted = true;
        if (this.newProductForm.valid) {
            const model: StockProducts = this.newProductForm.value;
            //console.log(model);
            this.adminService.addNonComplexProduct(model).subscribe({
                next: (response: any) => {
                    //console.log(response);
                    this.bsModalRef.hide();
                    this.sharedService.showNotificationAndReload(true, 'Success', response.value.message,true);
                },
                error: (error) => {
                    //console.log(error);
                    this.sharedService.showNotification(false, 'Error ocurred', error.error.value.message);
                },
            });
        }
    }

    
}
