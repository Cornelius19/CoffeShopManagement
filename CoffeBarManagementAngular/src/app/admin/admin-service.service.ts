import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddNewNonComplexProductComponent } from './formsModals/add-new-non-complex-product/add-new-non-complex-product.component';
import { ModifyProductModalComponent } from './formsModals/modify-product-modal/modify-product-modal.component';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { StockProducts } from '../shared/models/stockProducts';
import { applyStyles } from '@popperjs/core';
import { AddNewProductCategoryComponent } from './formsModals/add-new-product-category/add-new-product-category.component';
import { ModifyProductCategoryComponent } from './formsModals/modify-product-category/modify-product-category.component';
import { AddCategory } from '../shared/models/addCategory';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    constructor(private http: HttpClient, private modalService: BsModalService) {}

    bsModalRef?: BsModalRef;

    getStock() {
        return this.http.get<any>(`${environment.appUrl}/api/products/get-stock`);
    }

    showModifyProduct(
        productId: number,
        name: string,
        unitPrice: number,
        unitMeasure: string,
        availableForUser: boolean,
        complexProduct: boolean,
        categoryId: number,
        quantity: number,
        supplyCheck: number,
    ) {
        const initialState: ModalOptions = {
            initialState: {
                productId,
                name,
                unitPrice,
                unitMeasure,
                availableForUser,
                complexProduct,
                categoryId,
                quantity,
                supplyCheck,
            },
        };
        this.bsModalRef = this.modalService.show(ModifyProductModalComponent, initialState);
    }
    modifyProduct(model: StockProducts) {
        return this.http.put(`${environment.appUrl}/api/products/modify-nonComplexProduct`, model);
    }

    showAddNewNonComplexProduct() {
        this.bsModalRef = this.modalService.show(AddNewNonComplexProductComponent);
    }
    addNonComplexProduct(model: StockProducts) {
        return this.http.post(`${environment.appUrl}/api/products/add-new-product-noncomplex`, model);
    }

    showAddNewProductCategory() {
        this.bsModalRef = this.modalService.show(AddNewProductCategoryComponent);
    }
    addNewCategory(model: AddCategory) {
        return this.http.post(`${environment.appUrl}/api/category/add-category`, model);
    }

    showModifyProductCategory() {
        this.bsModalRef = this.modalService.show(ModifyProductCategoryComponent);
    }

    modifyProductCategory(model: AddCategory) {
        this.http.put(`${environment.appUrl}/api/category/modify-product-category`, model);
    }
}
