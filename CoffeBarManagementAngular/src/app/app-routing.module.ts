import { NgModule, model } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { MenuComponent } from './menu/menu.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RoleGuard } from './shared/guards/authorization.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Roles } from '../dependencies/roles';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'account', loadChildren: () => import ('./account/account.module').then(module => module.AccountModule)}, //lazy loading,  
  {path: 'not-found', component:NotFoundComponent},
  {path: 'menu', component:MenuComponent},
  {path: 'reservation', component:ReservationComponent, canActivate: [RoleGuard], data: {roles: [Roles.Admin,Roles.Client]}},
  {path: 'dashboard', component:DashboardComponent, canActivate: [RoleGuard], data: {roles: [Roles.Admin]}},
  {path: '**', component:NotFoundComponent, pathMatch: 'full'}, //in case someoane enter un unexisting path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
