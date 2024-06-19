import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MenuService } from '../../../menu/menu.service';
import { GetCategories } from '../../../shared/models/getCategories';
import { StockProducts } from '../../../shared/models/stockProducts';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin-service.service';
import { GetComponentProducts } from '../../../shared/models/getComponentProducts';
import { error } from 'jquery';
import { AddComplexProduct } from '../../../shared/models/addComplexProduct';
import { ProductComponent } from '../../../shared/models/productComponent';

@Component({
    selector: 'app-add-complex-product',
    templateUrl: './add-complex-product.component.html',
    styleUrls: ['./add-complex-product.component.css'],
})
export class AddComplexProductComponent implements OnInit {
    categoryList: GetCategories[] = [];
    componentProductsList: GetComponentProducts[] = [];
    newProductForm: FormGroup = new FormGroup({});
    isSubmitted: boolean = false;
    modifyStatus: boolean = false;

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
    componentProducts: ProductComponent[] = [];

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private adminService: AdminService,
        private sharedService: SharedService,
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getCategories();
        this.getComponentProducts();
    }

    initializeForm() {
        if (this.modifyStatus == false) {
            this.newProductForm = this.formBuilder.group({
                name: ['', [Validators.required]],
                unitPrice: ['', [Validators.required, Validators.min(0)]],
                unitMeasure: ['', [Validators.required]],
                availableForUser: ['', [Validators.required]],
                categoryId: ['', [Validators.required]],
                tva: ['', [Validators.required, Validators.min(0)]],
                productComponenetsId: this.formBuilder.array([]),
            });
        } else {
            this.newProductForm = this.formBuilder.group({
                name: [this.name, [Validators.required]],
                unitPrice: [this.unitPrice, [Validators.required, Validators.min(0)]],
                unitMeasure: [this.unitMeasure, [Validators.required]],
                availableForUser: [this.availableForUser, [Validators.required]],
                categoryId: [this.categoryId, [Validators.required]],
                tva: [this.tva, [Validators.required, Validators.min(0)]],
                productComponenetsId: this.formBuilder.array(this.componentProducts),
            });
        }
    }

    get productComponenetsId(): FormArray {
        return this.newProductForm.get('productComponenetsId') as FormArray;
    }

    addComponentProduct() {
        const componentProductForm = this.formBuilder.group({
            id: ['', [Validators.required]],
            used_quantity: ['', [Validators.required, Validators.min(0)]],
        });

        this.productComponenetsId.push(componentProductForm);
    }

    removeComponentProduct(index: number) {
        this.productComponenetsId.removeAt(index);
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
            const model: AddComplexProduct = this.newProductForm.value;
            console.log(model);

            this.adminService.addComplexProduct(model).subscribe({
                next: (response: any) => {
                    this.bsModalRef.hide();
                    this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                },
                error: (error) => {
                    this.sharedService.showNotification(false, 'Error occurred', error.error.value.message);
                },
            });
        }
    }

    getComponentProducts() {
        this.adminService.getComponentProducts().subscribe({
            next: (response: any) => {
                this.componentProductsList = response;
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
