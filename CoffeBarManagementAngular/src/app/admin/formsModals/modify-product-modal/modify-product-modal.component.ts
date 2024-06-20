import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MenuService } from '../../../menu/menu.service';
import { GetCategories } from '../../../shared/models/getCategories';
import { StockProducts } from '../../../shared/models/stockProducts';
import { AdminService } from '../../admin-service.service';
import { SharedService } from '../../../shared/shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modify-product-modal',
    templateUrl: './modify-product-modal.component.html',
    styleUrl: './modify-product-modal.component.css',
})
export class ModifyProductModalComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private adminService: AdminService,
        private sharedService: SharedService,
        private router: Router,
    ) {}

    public categoryList: GetCategories[] = [];
    modifyProductForm: FormGroup = new FormGroup({});
    isSubmitted: boolean = false;

    productId: number = 0;
    name: string = '';
    unitPrice: number = 0;
    unitMeasure: string = '';
    availableForUser: boolean = false;
    complexProduct: boolean = false;
    categoryId: number = 0;
    quantity: number = 0;
    supplyCheck: number = 0;
    tva: number = 0;

    ngOnInit(): void {
        this.initializeForm();
        this.getCategories();
    }

    initializeForm() {
        this.modifyProductForm = this.formBuilder.group({
            productId: [this.productId],
            name: [this.name, [Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
            unitPrice: [this.unitPrice, [Validators.required, Validators.min(0)]],
            unitMeasure: [this.unitMeasure, [Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
            availableForUser: [this.availableForUser, [Validators.required]],
            categoryId: [this.categoryId, [Validators.required]],
            quantity: [this.quantity, [Validators.required, Validators.min(0)]],
            supplyCheck: [this.supplyCheck, [Validators.required, Validators.min(0)]],
            tva: [this.tva, [Validators.required, Validators.min(0)]],
        });
    }

    modifyProduct() {
        if (confirm('Are you sure you want to apply this changes?')) {
            this.isSubmitted = true;
            if (this.modifyProductForm.valid) {
                const productModel: StockProducts = this.modifyProductForm.value;
                console.log(productModel);

                this.adminService.modifyProduct(productModel).subscribe({
                    next: (response: any) => {
                        this.bsModalRef.hide()
                        this.sharedService.showNotificationAndReload(true, 'Product modified', response.value.message,true);
                    },
                    error: (error) => {
                        this.sharedService.showNotification(false, 'Error appear', error.error.error.message);
                    },
                });
            }
        }
    }
    getCategories() {
        this.menuService.getAllCategories().subscribe({
            next: (response: any) => {
                this.categoryList = response;
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
