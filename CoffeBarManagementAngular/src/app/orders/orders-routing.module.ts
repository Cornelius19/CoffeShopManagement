import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ActiveOrderComponent } from './active-order/active-order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { CartComponent } from './cart/cart.component';
import { QRCodeScannerComponent } from './qrcode-scanner/qrcode-scanner.component';


const routes: Routes = [
  { path: 'active-order', component: ActiveOrderComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'cart', component: CartComponent },
  { path: 'qr-scanner', component: QRCodeScannerComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
