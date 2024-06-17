import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddNewNonComplexProductComponent } from './formsModals/add-new-non-complex-product/add-new-non-complex-product.component';
import { ModifyProductModalComponent } from './formsModals/modify-product-modal/modify-product-modal.component';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { StockProducts } from '../shared/models/stockProducts';
import { Obj, applyStyles } from '@popperjs/core';
import { AddNewProductCategoryComponent } from './formsModals/add-new-product-category/add-new-product-category.component';
import { ModifyProductCategoryComponent } from './formsModals/modify-product-category/modify-product-category.component';
import { AddCategory } from '../shared/models/addCategory';
import { GetCategories } from '../shared/models/getCategories';
import { AddNewBalanceCategoryComponent } from './formsModals/add-new-balance-category/add-new-balance-category.component';
import { ModifyBalanceCategoryComponent } from './formsModals/modify-balance-category/modify-balance-category.component';
import { AddBalanceCategory } from '../shared/models/addBalanceCategory';
import { BalanceCategories } from '../shared/models/balanceCategories';
import { AddComplexProductComponent } from './formsModals/add-complex-product/add-complex-product.component';
import { AddComplexProduct } from '../shared/models/addComplexProduct';
import { ModifyComplexProductComponent } from './formsModals/modify-complex-product/modify-complex-product.component';
import { RegisterNewEmployeeDto } from '../shared/models/registerEmployeeDto';
import { ModifiedEmployeeModalComponent } from './formsModals/modified-employee-modal/modified-employee-modal.component';
import { AddTableComponent } from './formsModals/add-table/add-table.component';

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
        tva: number,
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
                tva,
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

    showModifyEmployee(employeeId: number, salary: number, role:string) {
        const initialState: ModalOptions = {
            initialState: {
                employeeId,
                salary,
                role,
            },
        };
        this.bsModalRef = this.modalService.show(ModifiedEmployeeModalComponent, initialState);
    }

    showAddNewTable(capacity: number,modifyStatus:boolean) {
        const initialState: ModalOptions = {
            initialState: {
                capacity,
                modifyStatus,
            },
        };
        this.bsModalRef = this.modalService.show(AddTableComponent, initialState);
    }

    showModifyTable(tableId:number,capacity: number,modifyStatus:boolean) {
        const initialState: ModalOptions = {
            initialState: {
                capacity,
                modifyStatus,
                tableId
            },
        };
        this.bsModalRef = this.modalService.show(AddTableComponent, initialState);
    }

    addNewBalanceCategory(model: AddBalanceCategory) {
        return this.http.post(`${environment.appUrl}/api/category/add-balance-category`, model);
    }

    modifyBalanceCategory(model: BalanceCategories) {
        return this.http.post(`${environment.appUrl}/api/category/modify-balance-category`, model);
    }

    showAddNewComplexProduct() {
        this.bsModalRef = this.modalService.show(AddComplexProductComponent);
    }

    showModifyComplexProduct(name:string,unitPrice:number,unitMeasure:number,availableUser:boolean) {
        this.bsModalRef = this.modalService.show(ModifyComplexProductComponent);
    }

    getComponentProducts() {
        return this.http.get(`${environment.appUrl}/api/products/get-component-products`);
    }

    addComplexProduct(model: AddComplexProduct) {
        return this.http.post(`${environment.appUrl}/api/products/add-new-product-complex`, model);
    }

    getStockProductsReportData(categoryId: number){
        return this.http.get<any[]>(`${environment.appUrl}/api/reports/get-stock-products-report/${categoryId}`);
    }

    registerNewEmployee(model: RegisterNewEmployeeDto){
        return this.http.post(`${environment.appUrl}/api/admin/register-employee`,model);
    }


    getEmployeeData(){
        return this.http.get(`${environment.appUrl}/api/admin/get-employees`);
    }

    lockUnlockEmployee(employeeId: number,status:boolean){
        return this.http.put(`${environment.appUrl}/api/admin/lock-unlock-employee/${employeeId}/${status}`,null);
    }

    modifyEmployeeData(model: Object){
        return this.http.put(`${environment.appUrl}/api/admin/modify-employee`,model);
    }

    getOrdersByMonthsStatistic(){
        return this.http.get(`${environment.appUrl}/api/admin/get-orders-data-chart`);
    }

    addNewTable(model:Object){
        return this.http.post(`${environment.appUrl}/api/tables/add-table`,model);
    }

    modifyTableCapacity(tableId: number, model: Object){
        return this.http.put(`${environment.appUrl}/api/tables/change-table-capacity/${tableId}`,model);
    }

    deleteTable(tableId:number){
        return this.http.delete(`${environment.appUrl}/api/tables/delete-table/${tableId}`);
    }
}
