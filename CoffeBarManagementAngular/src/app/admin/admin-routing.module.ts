import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { StockProductsComponent } from './stock-products/stock-products.component';
import { ProductCategoriesComponent } from './categories/product-categories/product-categories.component';
import { BalancingCategoriesComponent } from './categories/balancing-categories/balancing-categories.component';
import { ReportsComponent } from './reports/reports.component';

const routes : Routes = [
  {path:'dashboard', component: Dashboard1Component},
  {path:'stock-products', component: StockProductsComponent},
  {path:'product-categories', component: ProductCategoriesComponent},
  {path:'balancing-categories', component: BalancingCategoriesComponent},
  {path:'reports', component: ReportsComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports:[
    RouterModule,
  ]
})
export class AdminRoutingModule { }
