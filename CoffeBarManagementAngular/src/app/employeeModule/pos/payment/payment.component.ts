import { Component, OnInit } from '@angular/core';
import { CartProduct } from '../../../shared/models/cartProduct';
import { PosService } from '../pos.service';
import { environment } from '../../../../environments/environment.development';
import { CreateEmployeeOrder } from '../../../shared/models/createEmployeeOrderDto';
import { OrderProductsClient } from '../../../shared/models/orderProductsClient';
import { SharedService } from '../../../shared/shared.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { auto } from '@popperjs/core';
import { OrderNoteData } from '../../../shared/models/orderNoteData';
import { Router } from '@angular/router';
import { ImageService } from '../../../shared/ImageService';
import { style } from '@angular/animations';
import { ReceiptData } from '../../../shared/models/receipdData';
import { OrderProduct } from '../../../shared/models/orderProduct';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
    constructor(private posService: PosService, public sharedService: SharedService, private router: Router, private imageService: ImageService) {}

    cartProducts: CartProduct[] = [];
    totalPrice: number = 0;
    tva9: number = 0;
    tva19: number = 0;
    inputValue: string = '';
    changeValue: string = '';
    numpad: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
    tableId: number = 0;
    orderNoteData: OrderNoteData = {} as OrderNoteData;
    orderIdForPayment: number = 0;
    cartProductFromPaymentOrder: CartProduct[] = [];
    receiptData: ReceiptData = {} as ReceiptData;

    ngOnInit(): void {
        this.cartProducts = this.posService.getCartProductsToList();
        
        const state = history.state;
        this.tableId = state.tableIdForOrder;
        this.checkPaymentOrderExist();
        this.getTotal();
        this.calculateTva();
    }
    checkPaymentOrderExist() {
        this.cartProductFromPaymentOrder = this.posService.getModifyCartProductsToList();
        const orderId = localStorage.getItem(environment.modifyingOrderId);
        if (orderId) {
            this.orderIdForPayment = parseInt(orderId);
        }
    }

    addToInput(value: string) {
        if (value === '.' && this.inputValue.includes('.')) {
            return; // prevent multiple dots
        }
        this.inputValue += value;
        let change = parseFloat(this.inputValue) - this.totalPrice;
        let roundedChange = change.toFixed(2);
        this.changeValue = roundedChange.toString();
    }

    clearInput() {
        this.inputValue = '';
        this.changeValue = '';
    }

    getTotal() {
        if (this.orderIdForPayment == 0) {
            if (this.cartProducts.length > 0) {
                for (let item of this.cartProducts) {
                    this.totalPrice += item.total;
                }
            }
        } else {
            this.cartProductFromPaymentOrder = this.posService.getModifyCartProductsToList();
            //console.log(this.cartProductFromPaymentOrder);

            if (this.cartProductFromPaymentOrder.length > 0) {
                for (let item of this.cartProductFromPaymentOrder) {
                    this.totalPrice += item.total;
                }
            }
        }
    }

    calculateTva() {
        if (this.orderIdForPayment == 0) {
            if (this.cartProducts.length > 0) {
                for (let item of this.cartProducts) {
                    if (item.tva == 9) {
                        this.tva9 += item.total * 0.09;
                    } else {
                        this.tva19 += item.total * 0.19;
                    }
                }
            }
        } else {
            if (this.cartProductFromPaymentOrder.length > 0) {
                for (let item of this.cartProductFromPaymentOrder) {
                    if (item.tva == 9) {
                        this.tva9 += item.total * 0.09;
                    } else {
                        this.tva19 += item.total * 0.19;
                    }
                }
            }
        }
    }

    createPayedOrder(paymentMethod: number) {
        let payment: string = '';
        let cash: string;
        let change: string;
        if (paymentMethod == 1) {
            payment = 'cash';
            if (this.inputValue.length > 0) {
                cash = this.inputValue;
                change = this.changeValue;
            }else{
                cash = this.totalPrice.toString();
                change = '0';
            }
        } else {
            payment = 'card';
            cash = '-';
            change = '-';
        }
        if (parseFloat(this.changeValue) < 0 && paymentMethod == 1) {
            this.sharedService.showNotification(false, 'Error', 'Change must be a positive value');
        } else {
            if (this.orderIdForPayment != 0) {
                this.posService.changeStatusToFinished(this.orderIdForPayment, 0).subscribe({
                    next: (response: any) => {
                        this.sharedService.showNotification(true, 'Success', response.value.message);
                        localStorage.removeItem(environment.modifyingOrderId);
                        localStorage.removeItem(environment.modifyCartProducts);
                        this.generateReceiptPdf(this.orderIdForPayment, payment, cash, change);
                        this.router.navigateByUrl('/employees/pos');
                    },
                    error: (error:any) => {
                        this.sharedService.showNotification(false, error.error.value.title, error.error.value.message);

                    },
                });
            } else {
                const product: CartProduct[] = this.posService.getCartProductsToList();
                const orderProduct: OrderProductsClient[] = [];

                if (product.length > 0) {
                    for (let item of product) {
                        const productToAdd: OrderProductsClient = {
                            productId: item.productId,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity,
                        };
                        orderProduct.push(productToAdd);
                    }
                    let model: CreateEmployeeOrder = {
                        tableId: this.tableId,
                        products: orderProduct,
                    };
                    const userId = this.sharedService.getUserId();

                    if (userId) {
                        this.posService.createOrderEmployee(model, userId, true).subscribe({
                            next: (response: any) => {
                                localStorage.removeItem(environment.cartKey);
                                this.generateOrderNotePDF(response.value.orderId);
                                this.generateReceiptPdf(response.value.orderId, payment, cash, change);
                                this.router.navigateByUrl('/employees/pos');
                            },
                            error: (error: any) => {
                                this.sharedService.showNotification(false, 'Error ocurred', error.error.value.message);
                            },
                        });
                    }
                }
            }
        }
    }

    async generateOrderNotePDF(orderId: number) {
        this.sharedService.getOrderNote(orderId).subscribe({
            next: async (response: any) => {
                this.orderNoteData = {
                    organizationName: response.organizationName,
                    orderDate: new Date(response.orderDate),
                    tableId: response.tableId,
                    products: response.products,
                    employeeName: response.employeeName,
                    orderId: response.orderId,
                    orderStatus: response.orderStatus,
                    total: response.total,
                };
                let tableId: string = ' bar';
                if (this.orderNoteData.tableId >= 1) {
                    tableId = this.orderNoteData.tableId.toString();
                }
                const formatDate = (date: Date) => {
                    const options: Intl.DateTimeFormatOptions = {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    };
                    return date.toLocaleDateString('en-US', options);
                };
                const formattedDate = formatDate(this.orderNoteData.orderDate);
                const pageSize = {
                    width: 350,
                    height: auto as any,
                };
                const base64Image = await this.imageService.convertImageToBase64(
                    '../../../../assets/images/sdbar-high-resolution-logo-black-transparent.png',
                );
                const productsTableBody = [
                    [
                        { text: 'Name', style: 'tableHeader' },
                        { text: 'Quantity', style: 'tableHeader' },
                        { text: 'Unit Price', style: 'tableHeader' },
                        { text: 'Total', style: 'tableHeader' },
                    ],
                    ...this.orderNoteData.products.map((prod) => [
                        prod.productName,
                        prod.quantity.toString(),
                        `${prod.unitPrice}$`,
                        `${(prod.quantity * prod.unitPrice).toFixed(2)}$`,
                    ]),
                ];
                const docDefinition: any = {
                    pageSize: pageSize,
                    content: [
                        { image: base64Image, width: 100, height: 50, alignment: 'center' },
                        { text: `Date: ${formattedDate}`, fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
                        { text: 'Order Note', style: 'header', alignment: 'center' },
                        { text: this.orderNoteData.orderDate },
                        { text: `Table: ${tableId}`, style: 'subheader', alignment: 'center' },
                        { text: 'Products:', fontSize: 14, bold: true, margin: [0, 10, 0, 8] },
                        {
                            style: 'tableExample',
                            table: {
                                headerRows: 1,
                                body: productsTableBody,
                                margin: [0, 0, 0, 8],
                            },
                            layout: 'lightHorizontalLines',
                        },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }] },
                        { text: `Employee name: ${this.orderNoteData.employeeName}`, margin: [0, 15, 0, 0] },
                        { text: `Order: ${this.orderNoteData.orderId}` },
                        { text: `Order status: ${this.orderNoteData.orderStatus}`, margin: [0, 0, 0, 8] },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }] },
                        { text: `Total: ${this.orderNoteData.total.toFixed(2)}$`, style: 'header', margin: [0, 15, 30, 0], alignment: 'right' },
                    ],
                    styles: {
                        header: { fontSize: 20, bold: true },
                        subheader: { fontSize: 16, bold: true },
                        tableHeader: { bold: true, fontSize: 13, color: 'black' },
                        divider: { margin: [0, 10, 0, 10], alignment: 'center' },
                    },
                    defaultStyle: {
                        lineHeight: 1.5,
                    },
                };

                pdfMake.createPdf(docDefinition).download();
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    async generateReceiptPdf(orderId: number, payment: string, value: string, change: string) {
        this.sharedService.getReceiptData(orderId).subscribe({
            next: async (response: any) => {
                this.receiptData = {
                    name: response.name,
                    createdDate: new Date(response.createdDate),
                    cif: response.cif,
                    products: response.products,
                    adress: response.adress,
                    city: response.city,
                };
                //console.log(this.receiptData);
                const formatDate = (date: Date) => {
                    const options: Intl.DateTimeFormatOptions = {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    };
                    return date.toLocaleDateString('eu-EU', options);
                };

                const productsList: any[] = this.receiptData.products.map((prod: OrderProduct) => {
                    if (prod.quantity > 1) {
                        const totalPrice = (prod.quantity * prod.unitPrice).toFixed(2);
                        return [
                            { text: `${prod.quantity} x ${prod.unitPrice} $\n ${prod.productName}`, style: 'tableContent' },
                            { text: '9%', style: 'tableContent' }, // Assuming 9% VAT for all products
                            { text: `${totalPrice} USD`, style: 'tableContent' },
                        ];
                    } else {
                        return [
                            { text: `${prod.productName}`, style: 'tableContent' },
                            { text: '9%', style: 'tableContent' }, // Assuming 9% VAT for all products
                            { text: `${prod.unitPrice} USD`, style: 'tableContent' },
                        ];
                    }
                });

                let subtotalFor9 = 0;
                let subtotalFor19 = 0;
                this.receiptData.products.forEach((prod: OrderProduct) => {
                    if (prod.tva == 9) {
                        subtotalFor9 += prod.quantity * prod.unitPrice;
                    } else {
                        subtotalFor19 += prod.quantity * prod.unitPrice;
                    }
                });
                const tva9 = subtotalFor9 * 0.09;
                const tva19 = subtotalFor19 * 0.19;
                const total = subtotalFor19 + subtotalFor9;

                const formattedDate = formatDate(this.receiptData.createdDate);
                const pageSize = {
                    width: 350,
                    height: auto as any,
                };
                const docDefinition: any = {
                    pageSize: pageSize,
                    content: [
                        { text: `Receipt`, style: 'header', alignment: 'center' },
                        { text: `Name: ${this.receiptData.name}` },
                        { text: `Address: ${this.receiptData.adress}` },
                        { text: `City: ${this.receiptData.city}` },
                        { text: `CIF: ${this.receiptData.cif}` },

                        { text: '' }, // Empty line for spacing
                        {
                            columns: [
                                { width: '*', text: '' },
                                {
                                    width: 270,
                                    table: {
                                        headerRows: 1,
                                        widths: ['*', 'auto', 'auto'],
                                        body: [
                                            [
                                                { text: 'Description', style: 'tableHeader' },
                                                { text: 'TVA', style: 'tableHeader' },
                                                { text: 'Price ($)', style: 'tableHeader' },
                                            ],
                                            ...productsList,
                                        ],
                                        margin: [0, 10, 0, 8],
                                    },
                                    layout: 'lightHorizontalLines',
                                },
                            ],
                        },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0, lineWidth: 1 }] },
                        { text: `Total:    ${total.toFixed(2)} $`, alignment: 'right', style: 'subheader1', margin: [0, 10, 0, 0] },
                        { text: `Of which TVA 9%:    ${tva9.toFixed(2)} $`, alignment: 'right' },
                        { text: `Of which TVA 19%:    ${tva19.toFixed(2)} $`, alignment: 'right' },
                        { text: `Received cash:    ${value} $`, alignment: 'right' },
                        { text: `Change:    ${change} $`, alignment: 'right' },
                        { text: `Payment method: ${payment}`, margin: [0, 10, 0, 1] },
                        { text: `Date: ${formattedDate.split(',')[0].trimEnd()}`, margin: [0, 0, 0, 1] },
                        { text: `Time: ${formattedDate.split(',')[1].trim()}`, margin: [0, 0, 0, 1] }, // Extract time from formatted date
                        { text: `Receipt nr: 000${orderId}`, margin: [0, 0, 0, 1] },
                        { text: `POS nr: 001`, margin: [0, 0, 0, 10] },
                        { text: 'Thank you and have a great day! :)', style: 'subheader2', alignment: 'center' },
                    ],
                    styles: {
                        header: { fontSize: 30, bold: true },
                        subheader1: { fontSize: 20, bold: true },
                        subheader2: { fontSize: 16, bold: true },
                        tableHeader: { bold: true, fontSize: 13, color: 'black' },
                        divider: { margin: [0, 10, 0, 10], alignment: 'center' },
                    },
                    defaultStyle: {
                        lineHeight: 1.5,
                    },
                };

                pdfMake.createPdf(docDefinition).open();
            },
            error: (e) => {
                console.log(e);
            },
        });
    }
}
