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
import { GetCategories } from '../shared/models/getCategories';
import { AddNewBalanceCategoryComponent } from './formsModals/add-new-balance-category/add-new-balance-category.component';
import { ModifyBalanceCategoryComponent } from './formsModals/modify-balance-category/modify-balance-category.component';
import { AddBalanceCategory } from '../shared/models/addBalanceCategory';
import { BalanceCategories } from '../shared/models/balanceCategories';

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

    showModifyProductCategory(categoryId: number, categoryName: string, availableMenu: boolean) {
        const initialState: ModalOptions = {
            initialState: {
                categoryId,
                categoryName,
                availableMenu,
            },
        };
        this.bsModalRef = this.modalService.show(ModifyProductCategoryComponent, initialState);
    }

    modifyProductCategory(model: GetCategories) {
        return this.http.put(`${environment.appUrl}/api/category/modify-product-category`, model);
    }

    getBalanceCategories() {
        return this.http.get(`${environment.appUrl}/api/category/get-balancing-categories`);
    }

    showAddBalanceCategory() {
        this.bsModalRef = this.modalService.show(AddNewBalanceCategoryComponent);
    }

    showModifyBalanceCategory(removeCategoryId: number, removeCategoryName: string) {
        const initialState: ModalOptions = {
            initialState: {
                removeCategoryId,
                removeCategoryName,
            },
        };
        this.bsModalRef = this.modalService.show(ModifyBalanceCategoryComponent, initialState);
    }

    addNewBalanceCategory(model: AddBalanceCategory) {
        return this.http.post(`${environment.appUrl}/api/category/add-balance-category`, model);
    }

    modifyBalanceCategory(model: BalanceCategories) {
        return this.http.post(`${environment.appUrl}/api/category/modify-balance-category`, model);
    }
}
