import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        this.getAllProduct();
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            productId: ['', [Validators.required]],
            added_quantity: ['', [Validators.required]],
        });
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
        const productId = this.formGroup.get('productId')?.value;
        const quantity = this.formGroup.get('added_quantity')?.value;
        if (this.formGroup.valid) {
            if (productId != null && quantity != null) {
                if (confirm("The introduced quantity is correct?")) {
                    this.posService.addStockQuantity(productId, quantity).subscribe({
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
