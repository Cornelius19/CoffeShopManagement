import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { ItemsComponent } from './items/items.component';
import { RoutingMenuModule } from './routing-menu.module';



@NgModule({
  declarations: [
    CategoryComponent,
    ItemsComponent
  ],
  imports: [
    CommonModule,
    RoutingMenuModule
  ]
})
export class MenuModule { }
