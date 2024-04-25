import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { ActiveOrderComponent } from './active-order/active-order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrdersRoutingModule } from './orders-routing.module';



@NgModule({
  declarations: [
    CartComponent,
    ActiveOrderComponent,
    OrderHistoryComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
