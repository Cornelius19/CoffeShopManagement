import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ItemsComponent } from './items/items.component';

const routes: Routes = [
  { path: '', redirectTo: '/menu/category', pathMatch: 'full' },
  { path: 'category', component: CategoryComponent },
  { path: 'items/:id', component: ItemsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingMenuModule {}
