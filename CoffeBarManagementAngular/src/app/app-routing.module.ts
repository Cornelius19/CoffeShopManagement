import { NgModule, model } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { RoleGuard } from './shared/guards/authorization.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { Roles } from '../dependencies/roles';

const routes: Routes = [
    //client paths
    { path: '', component: HomeComponent },
    { path: 'account', loadChildren: () => import('./account/account.module').then((module) => module.AccountModule) }, //lazy loading
    { path: 'menu', loadChildren: () => import('./menu/menu.module').then((module) => module.MenuModule) }, //lazy loading
    {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then((module) => module.OrdersModule),
        canActivate: [RoleGuard],
        data: { roles: [Roles.Admin, Roles.Client] },
    }, //lazy loading
    {
        path: 'reservations',
        loadChildren: () => import('./reservations/reservations.module').then((module) => module.ReservationsModule),
        canActivate: [RoleGuard],
        data: { roles: [Roles.Admin, Roles.Client] },
    },

    //admin paths
    { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { roles: [Roles.Admin] } },

    //employee paths
    {
        path: 'employees',
        loadChildren: () => import('./employeeModule/employee.module').then((module) => module.EmployeeModule),
        canActivate: [RoleGuard],
        data: { roles: [Roles.Employee] },
    },

    //shared paths
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' }, //in case someone enter an invalid path
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
