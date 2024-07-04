import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { StockProductsComponent } from './stock-products/stock-products.component';
import { ProductCategoriesComponent } from './categories/product-categories/product-categories.component';
import { BalancingCategoriesComponent } from './categories/balancing-categories/balancing-categories.component';
import { ReportsComponent } from './reports/reports.component';
import { CreateNewEmployeeComponent } from './create-new-employee/create-new-employee.component';
import { EmployeesDataComponent } from './employees-data/employees-data.component';
import { UsersComponent } from './users/users.component';
import { TablesComponent } from './tables/tables.component';
import { OrdersComponent } from './orders/orders.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { StockBalanceComponent } from '../employeeModule/stock-balance/stock-balance.component';
import { StockBalanceDataComponent } from './stock-balance-data/stock-balance-data.component';
import { RoleGuard } from '../shared/guards/authorization.guard';
import { Roles } from '../../dependencies/roles';

const routes: Routes = [
    { path: 'dashboard', component: Dashboard1Component },
    { path: 'stock-products', component: StockProductsComponent },
    { path: 'product-categories', component: ProductCategoriesComponent },
    { path: 'balancing-categories', component: BalancingCategoriesComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'create-employee', component: CreateNewEmployeeComponent },
    { path: 'employees-data', component: EmployeesDataComponent },
    { path: 'clients', component: UsersComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'reservations', component: ReservationsComponent },
    { path: 'stock-balance-data', component: StockBalanceDataComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
