import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { StockProductsComponent } from './stock-products/stock-products.component';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminRoutingModule } from './admin-routing.module';
import { AddNewNonComplexProductComponent } from './formsModals/add-new-non-complex-product/add-new-non-complex-product.component';
import { ModifyProductModalComponent } from './formsModals/modify-product-modal/modify-product-modal.component';
import { SharedModule } from '../shared/shared.module';
import { AddComplexProductComponent } from './formsModals/add-complex-product/add-complex-product.component';
import { ProductCategoriesComponent } from './categories/product-categories/product-categories.component';
import { BalancingCategoriesComponent } from './categories/balancing-categories/balancing-categories.component';
import { AddNewProductCategoryComponent } from './formsModals/add-new-product-category/add-new-product-category.component';
import { ModifyProductCategoryComponent } from './formsModals/modify-product-category/modify-product-category.component';
import { AddNewBalanceCategoryComponent } from './formsModals/add-new-balance-category/add-new-balance-category.component';
import { ModifyBalanceCategoryComponent } from './formsModals/modify-balance-category/modify-balance-category.component';
import { ModifyComplexProductComponent } from './formsModals/modify-complex-product/modify-complex-product.component';
import { ReportsComponent } from './reports/reports.component';
import { CreateNewEmployeeComponent } from './create-new-employee/create-new-employee.component';
import { EmployeesDataComponent } from './employees-data/employees-data.component';
import { ModifiedEmployeeModalComponent } from './formsModals/modified-employee-modal/modified-employee-modal.component';
import { UsersComponent } from './users/users.component';
import { TablesComponent } from './tables/tables.component';
import { AddTableComponent } from './formsModals/add-table/add-table.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderProductsModalComponent } from './formsModals/order-products-modal/order-products-modal.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { StockBalanceDataComponent } from './stock-balance-data/stock-balance-data.component';



@NgModule({
  declarations: [
    Dashboard1Component,
    StockProductsComponent,
    AddNewNonComplexProductComponent,
    ModifyProductModalComponent,
    AddComplexProductComponent,
    ProductCategoriesComponent,
    BalancingCategoriesComponent,
    AddNewProductCategoryComponent,
    ModifyProductCategoryComponent,
    AddNewBalanceCategoryComponent,
    ModifyBalanceCategoryComponent,
    ModifyComplexProductComponent,
    ReportsComponent,
    CreateNewEmployeeComponent,
    EmployeesDataComponent,
    ModifiedEmployeeModalComponent,
    UsersComponent,
    TablesComponent,
    AddTableComponent,
    OrdersComponent,
    OrderProductsModalComponent,
    ReservationsComponent,
    StockBalanceDataComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FontAwesomeModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
