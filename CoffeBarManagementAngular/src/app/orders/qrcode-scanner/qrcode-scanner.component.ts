import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    NgxScannerQrcodeComponent,
    NgxScannerQrcodeService,
    ScannerQRCodeConfig,
    ScannerQRCodeResult,
    ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';
import { environment } from '../../../environments/environment.development';
import { SharedService } from '../../shared/shared.service';
import { OrdersService } from '../orders.service';
import { NewClientOrder } from '../../shared/models/newClientOrder';
import { OrderProduct } from '../../shared/models/orderProduct';
import { OrderProductsClient } from '../../shared/models/orderProductsClient';

@Component({
    selector: 'app-qrcode-scanner',
    templateUrl: './qrcode-scanner.component.html',
    styleUrl: './qrcode-scanner.component.css',
})
export class QRCodeScannerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('action', { static: true }) scanner!: NgxScannerQrcodeComponent;
    @ViewChild('action') action!: NgxScannerQrcodeComponent;

    public percentage = 80;
    public quality = 100;

    constructor(
        private router: Router,
        private sharedService: SharedService,
        private ordersService: OrdersService,
        private qrcode: NgxScannerQrcodeService,
    ) {}

    ngOnDestroy(): void {
        this.scanner.stop();
    }

    ngOnInit(): void {
        this.scanner.start();
    }

    ngAfterViewInit(): void {
        {
            const interval = setInterval(() => {
                const button = document.getElementById('triggerButton');
                if (button) {
                    clearInterval(interval);
                    this.onScanSuccess(this.scanner.data.value);
                    this.createNewClientOrder();
                }
            }, 500);
        }
    }
    public config: ScannerQRCodeConfig = {
        constraints: {
            video: {
                width: window.innerWidth,
            },
        },
        isBeep: false,
    };

    public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
    public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

    onScanSuccess(value: ScannerQRCodeResult[]): void {
        if (value.length > 0) {
            const scannedValue = value[0].value;
            localStorage.setItem(environment.tableID, scannedValue);
            // Stop the scanner
            this.scanner.stop();
            // Redirect to another page
        } else {
            console.log('No value scanned.');
        }
    }

    createNewClientOrder() {
        const userId = this.sharedService.getUserId();
        const stringTalbeId = localStorage.getItem(environment.tableID);
        if (userId && stringTalbeId) {
            const tableId = parseInt(stringTalbeId);
            const listToConvert = this.ordersService.getCartItemsToList();
            if (listToConvert) {
                const model: OrderProductsClient[] = [];
                for (let product of listToConvert) {
                    const modelProduct: OrderProductsClient = {
                        productId: product.productId,
                        quantity: product.quantity,
                        unitPrice: product.unitPrice,
                    };
                    model.push(modelProduct);
                }
                if (model) {
                    const modelToSend: NewClientOrder = {
                        products: model,
                    };
                    this.ordersService.createNewClientOrder(modelToSend, userId, tableId).subscribe({
                        next: (response: any) => {
                            this.sharedService.showNotification(true, response.value.title, response.value.message);
                            this.resetList();
                            localStorage.removeItem(environment.tableID);
                            this.router.navigateByUrl('/orders/active-order');
                        },
                        error: (error) => {
                            this.sharedService.showNotification(false, error.error.value.title, error.error.value.message);
                            localStorage.removeItem(environment.tableID);
                            this.router.navigateByUrl('/orders/cart');
                        },
                    });
                }
            } else {
                console.error('The product list is missing!');
            }
        } else {
            console.error('Somthing went wrong!');
        }
    }

    resetList() {
        this.ordersService.clearCart();
        this.ordersService.getCounter();
    }

    public onEvent(e: ScannerQRCodeResult[], action?: any): void {
        // e && action && action.pause();
    }

    public handle(action: any, fn: string): void {
        const playDeviceFacingBack = (devices: any[]) => {
            // front camera or back camera check here!
            const device = devices.find((f) => /back|rear|environment/gi.test(f.label)); // Default Back Facing Camera
            action.playDevice(device ? device.deviceId : devices[0].deviceId);
        };

        if (fn === 'start') {
            action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
        } else {
            action[fn]().subscribe((r: any) => console.log(fn, r), alert);
        }
    }

    public onSelects(files: any) {
        this.qrcode.loadFiles(files, this.percentage, this.quality).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
            this.qrCodeResult = res;
        });
    }

    public onSelects2(files: any) {
        this.qrcode.loadFilesToScan(files, this.config, this.percentage, this.quality).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
            this.qrCodeResult2 = res;
        });
    }

    public onGetConstraints() {
        const constrains = this.action.getConstraints();
    }

    public applyConstraints() {
        const constrains = this.action.applyConstraints({
            ...this.action.getConstraints(),
            width: 510,
        });
    }
}
