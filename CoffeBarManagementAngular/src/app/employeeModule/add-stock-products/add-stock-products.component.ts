import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PosService } from '../pos/pos.service';
import { GetComponentProducts } from '../../shared/models/getComponentProducts';
import { error } from 'jquery';
import { SharedService } from '../../shared/shared.service';

@Component({
    selector: 'app-add-stock-products',
    templateUrl: './add-stock-products.component.html',
    styleUrl: './add-stock-products.component.css',
})
export class AddStockProductsComponent implements OnInit {
    constructor(private posService: PosService, private formBuilder: FormBuilder, private sharedService: SharedService) {}

    isSubmitted: boolean = false;
    formGroup: FormGroup = new FormGroup({});
    allProducts: GetComponentProducts[] = [];

    ngOnInit(): void {
        this.initializeForm();
        this.addNewProduct();
        this.getAllProduct();
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            productsToAdd: this.formBuilder.array([]),
        });
    }

    get productsToAdd(): FormArray {
        return this.formGroup.get('productsToAdd') as FormArray;
    }

    addNewProduct() {
        const newProduct = this.formBuilder.group({
            productId: ['', [Validators.required]],
            added_quantity: ['', [Validators.required,Validators.min(1),Validators.max(199)]],
        });
        this.productsToAdd.push(newProduct);
    }

    removeNewProduct(index: number) {
        this.productsToAdd.removeAt(index);
    }

    getAllProduct() {
        this.posService.getAllProductStockBalance().subscribe({
            next: (response: any) => {
                this.allProducts = response;
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    addQuantity() {
        this.isSubmitted = true;
        if (this.formGroup.valid) {
            console.log(this.formGroup.value);
            const list:Object[] = this.formGroup.get('productsToAdd')?.value;
            if(list.length> 0){
                if (confirm('The introduced quantity is correct?')) {
                    this.posService.addStockQuantity(list).subscribe({
                        next: (response: any) => {
                            this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                            this.formGroup.reset();
                            this.isSubmitted = false;
                        },
                        error: (error: any) => {
                            this.sharedService.showNotification(false, 'Error', error.error.value.message);
                        },
                    });
                }
            }
        }
    }
}
