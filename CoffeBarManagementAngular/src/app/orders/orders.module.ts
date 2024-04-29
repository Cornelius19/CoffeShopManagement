import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { ActiveOrderComponent } from './active-order/active-order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { QRCodeScannerComponent } from './qrcode-scanner/qrcode-scanner.component';

LOAD_WASM().subscribe();

@NgModule({
  declarations: [
    CartComponent,
    ActiveOrderComponent,
    OrderHistoryComponent,
    QRCodeScannerComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    NgxScannerQrcodeModule
  ]
})
export class OrdersModule { }
