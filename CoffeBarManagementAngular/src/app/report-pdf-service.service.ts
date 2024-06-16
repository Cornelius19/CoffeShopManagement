import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { auto } from '@popperjs/core';
import { PosClosedReport } from './shared/models/PosReport/PosCloseReport';
import { ImageService } from './shared/ImageService';
import { text } from '@fortawesome/fontawesome-svg-core';
import { SharedService } from './shared/shared.service';
import { style } from '@angular/animations';
import { OrderNoteData } from './shared/models/orderNoteData';
import { ClosePosFiscalReport } from './shared/models/PosReport/ClosePosFiscalReport';
import { PosService } from './employeeModule/pos/pos.service';
import { formatDate } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root',
})
export class ReportPdfServiceService {
    constructor(private imageService: ImageService, private sharedService: SharedService, private posService: PosService) {}
    orderNoteData: OrderNoteData = {} as OrderNoteData;
    posCloseFiscalReport: ClosePosFiscalReport = {} as ClosePosFiscalReport;

    async generateClosePosReportPdf(report: PosClosedReport) {
        const logoBase64 = await this.imageService.convertImageToBase64('../assets/images/sdbar-high-resolution-logo-black-transparent.png');

        const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(report.createdAt);
        const requestDate = this.sharedService.convertDateToDDMMYY(report.forDay);

        const employeesTableBody = [
            [
                { text: 'Employee Name', style: 'tableHeader' },
                { text: 'Taken Orders', style: 'tableHeader' },
                { text: 'Delivered Orders', style: 'tableHeader' },
            ],
        ];
        report.employeesOrders.forEach((employee) => {
            employeesTableBody.push([
                {
                    text: employee.name || '',
                    style: '',
                },
                {
                    text: employee.takenOrders != null ? employee.takenOrders.toString() : '',
                    style: '',
                },
                {
                    text: employee.delieveredOrders != null ? employee.delieveredOrders.toString() : '',
                    style: '',
                },
            ]);
        });

        const productsTableBody = [
            [
                { text: 'Product Name', style: 'tableHeader' },
                { text: 'Sold Quantity', style: 'tableHeader' },
                { text: 'Sold Value', style: 'tableHeader' },
            ],
        ];
        report.products.forEach((product) => {
            productsTableBody.push([
                {
                    text: product.name || '',
                    style: '',
                },
                {
                    text: product.selledQuantity != null ? product.selledQuantity.toString() : '',
                    style: '',
                },
                {
                    text: product.selledValue != null ? product.selledValue.toString() : '',
                    style: '',
                },
            ]);
        });

        const docDefinition: any = {
            content: [
                { image: logoBase64, width: 50, height: 30, alignment: 'right' },
                { text: 'REPORT: Pos Closing ', style: ['header', 'center'] },
                { text: `Created date: ${createdAt}`, style: 'normal' },
                { text: `Requested date: ${requestDate}`, style: 'normal' },
                { text: `Finished Orders: ${report.finishedOrdersCounter}`, style: 'subheader' },
                { text: `Canceled Orders: ${report.canceledOrdersCounter}`, style: 'subheader' },
                { text: `Total orders value: ${report.totalOrdersValue} $`, style: 'header' },
                { text: 'Employees Orders', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*'],
                        body: employeesTableBody,
                    },
                },
                { text: 'Products Sold', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*'],
                        body: productsTableBody,
                    },
                },
            ],
            styles: {
                normal: { fontSize: 14, margin: [0, 5, 0, 5] },
                header: { fontSize: 24, bold: true, margin: [0, 5, 0, 10] },
                center: { alignment: 'center', margin: [0, 5, 0, 5] },
                right: { alignment: 'right', margin: [0, 5, 0, 5] },
                subheader: { fontSize: 18, bold: true, margin: [0, 5, 0, 5] },
                tableHeader: { bold: true, fontSize: 13, color: 'black' },
                table: { margin: [0, 5, 0, 15] },
            },
            defaultStyles: {},
        };

        pdfMake.createPdf(docDefinition).open();
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
                        { image: base64Image, width: 100, height: 60, alignment: 'center' },
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

    async generateFiscalReportClosePos() {
        this.posService.getPosCloseFiscalReport().subscribe({
            next: async (response: any) => {
                this.posCloseFiscalReport = {
                    companyName: response.companyName,
                    adress: response.adress,
                    city: response.city,
                    cui: response.cui,
                    currentDate: new Date(response.currentDate),
                    finishedOrdersCounter: response.finishedOrdersCounter,
                    totalOrdersValue: response.totalOrdersValue,
                    total9Tva: response.total9Tva,
                    total19Tva: response.total19Tva,
                };
    
                if (this.posCloseFiscalReport.finishedOrdersCounter == 0) {
                    this.sharedService.showNotification(false, 'Error', 'Something went wrong, there are no orders for present day!');
                } else {
                    const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(this.posCloseFiscalReport.currentDate);
    
                    const pageSize = {
                        width: 350,
                        height: 'auto' as any,
                    };
    
                    const docDefinition: any = {
                        pageSize: pageSize,
                        content: [
                            { text: `Company Name: ${this.posCloseFiscalReport.companyName}`, style: ['normal', 'center'] },
                            { text: `Address: ${this.posCloseFiscalReport.adress}`, style: ['normal', 'center'] },
                            { text: `City: ${this.posCloseFiscalReport.city}`, style: ['normal', 'center'] },
                            { text: `CUI: ${this.posCloseFiscalReport.cui}`, style: ['normal', 'center'] },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0, lineWidth: 1 }] },
    
                            { text: 'Report: Fiscal Closure', style: 'header', alignment: 'center' },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0, lineWidth: 1 }] },
    
                            { text: `Receipts issued today: ${this.posCloseFiscalReport.finishedOrdersCounter} receipts`, style: 'normal',margin:[0,20,0,0] },
                            { text: `Total sales: ${this.posCloseFiscalReport.totalOrdersValue.toFixed(2)} $`, style: 'normal',margin:[0,0,0,20] },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0, lineWidth: 1 }] },

    
                            { text: `From which TVA:`, style: ['normal'],bold:'true',margin:[0,20,0,0] },
                            { text: `TVA 9%: ${this.posCloseFiscalReport.total9Tva.toFixed(2)} $`, style: 'normal' },
                            { text: `TVA 19%: ${this.posCloseFiscalReport.total19Tva.toFixed(2)} $`, style: 'normal',margin:[0,0,0,20]  },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0, lineWidth: 1 }] },

    
                            { text: `Total amount received: ${this.posCloseFiscalReport.totalOrdersValue} $`, style: 'subheader',margin:[0,20,0,0] },
                            { text: `Closing day date:`, style: ['normal', 'center'] },
                            { text: `${createdAt}`, style: ['normal', 'center'] },
                            { text: `POS: 001`, style: 'center' },
                        ],
                        styles: {
                            header: { fontSize: 20, bold: true, margin: [0, 7, 0, 0] },
                            normal: { fontSize: 14, bold: false, margin: [0, 0, 0, 0] },
                            center: { alignment: 'center' },
                            subheader: { fontSize: 16, bold: true },
                            tableHeader: { bold: true, fontSize: 13, color: 'black' },
                            divider: { margin: [0, 10, 0, 10], alignment: 'center' },
                        },
                        defaultStyle: {
                            lineHeight: 1.5,
                        },
                    };
                    pdfMake.createPdf(docDefinition).open();
                }
            },
            error: (e) => {
                console.log(e);
            },
        });
    }
    
}
