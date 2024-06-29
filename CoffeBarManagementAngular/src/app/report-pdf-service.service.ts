import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { auto, end } from '@popperjs/core';
import { PosClosedReport } from './shared/models/PosReport/PosCloseReport';
import { ImageService } from './shared/ImageService';
import { text } from '@fortawesome/fontawesome-svg-core';
import { SharedService } from './shared/shared.service';
import { style } from '@angular/animations';
import { OrderNoteData } from './shared/models/orderNoteData';
import { ClosePosFiscalReport } from './shared/models/PosReport/ClosePosFiscalReport';
import { PosService } from './employeeModule/pos/pos.service';
import { formatDate } from '@angular/common';
import { AdminService } from './admin/admin-service.service';
import { StockProductsReport } from './shared/models/Reports/stockProductsReport';
import { GetProducts } from './shared/models/getProducts';
import { OrderDetailsDto } from './shared/models/orderDetailsDto';
import { GetClientDataDto } from './shared/models/getClientsDataDto';
import { GetReservation } from './shared/models/getReservation';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root',
})
export class ReportPdfServiceService {
    constructor(
        private imageService: ImageService,
        private sharedService: SharedService,
        private posService: PosService,
        private adminService: AdminService,
    ) {}
    orderNoteData: OrderNoteData = {} as OrderNoteData;
    posCloseFiscalReport: ClosePosFiscalReport = {} as ClosePosFiscalReport;
    productStockReport: StockProductsReport[] = [];
    supplyProducts: GetProducts[] = [];
    ordersDetails: OrderDetailsDto[] = [];
    clientsData: GetClientDataDto[] = [];
    allReservations: GetReservation[] = [];

    async generateSelledProductsBetweenDatesPdf(report: PosClosedReport) {
        const logoBase64 = await this.imageService.convertImageToBase64('../assets/images/sdbar-high-resolution-logo-black-transparent.png');
        const today = new Date();
        const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(today);
        const startDate = this.sharedService.convertDateToDDMMYY(report.createdAt);
        const endDate = this.sharedService.convertDateToDDMMYY(report.forDay);

        const productsTableBody = [
            [
                { text: 'No.', style: 'tableHeader' },
                { text: 'Product Name', style: 'tableHeader' },
                { text: 'Sold Quantity', style: 'tableHeader' },
                { text: 'Sold Value', style: 'tableHeader' },
            ],
        ];
        report.products.forEach((product, index) => {
            productsTableBody.push([
                {
                    text: (index + 1).toString(),
                    style: '',
                },
                {
                    text: product.name || '',
                    style: '',
                },
                {
                    text: product.selledQuantity != null ? product.selledQuantity.toString() : '',
                    style: '',
                },
                {
                    text: ` ${product.selledValue != null ? product.selledValue.toFixed(2).toString() : ''} $`,
                    style: '',
                },
            ]);
        });

        const docDefinition: any = {
            content: [
                { image: logoBase64, width: 50, height: 30, alignment: 'right' },
                { text: 'REPORT ', style: ['header', 'center'] },
                { text: 'Products selled details ', style: ['header', 'center'] },
                { text: `Created date: ${createdAt}`, style: 'normal' },
                { text: `Date period: ${startDate} - ${endDate}`, style: 'normal' },
                { text: 'Products Sold', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        widths: [30, '*', '*', '*'],
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
                    text: product.selledValue != null ? product.selledValue.toFixed(2).toString() : '',
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
                { text: `Total orders value: ${report.totalOrdersValue.toFixed(2)} $`, style: 'header' },
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

    async generateClosePosReportBetweenDatesPdf(report: PosClosedReport) {
        const logoBase64 = await this.imageService.convertImageToBase64('../assets/images/sdbar-high-resolution-logo-black-transparent.png');
        const today = new Date();
        const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(today);
        const startDate = this.sharedService.convertDateToDDMMYY(report.createdAt);
        const endDate = this.sharedService.convertDateToDDMMYY(report.forDay);

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
                    text: product.selledValue != null ? product.selledValue.toFixed(2).toString() : '',
                    style: '',
                },
            ]);
        });

        const docDefinition: any = {
            content: [
                { image: logoBase64, width: 50, height: 30, alignment: 'right' },
                { text: 'REPORT: sales ', style: ['header', 'center'] },
                { text: `Created date: ${createdAt}`, style: 'normal' },
                { text: `Date period: ${startDate} - ${endDate}`, style: 'normal' },
                { text: `Finished Orders: ${report.finishedOrdersCounter}`, style: 'subheader' },
                { text: `Canceled Orders: ${report.canceledOrdersCounter}`, style: 'subheader' },
                { text: `Total orders value: ${report.totalOrdersValue.toFixed(2)} $`, style: 'header' },
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

                pdfMake.createPdf(docDefinition).open();
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

                            {
                                text: `Receipts issued today: ${this.posCloseFiscalReport.finishedOrdersCounter} receipts`,
                                style: 'normal',
                                margin: [0, 20, 0, 0],
                            },
                            {
                                text: `Total sales: ${this.posCloseFiscalReport.totalOrdersValue.toFixed(2)} $`,
                                style: 'normal',
                                margin: [0, 0, 0, 20],
                            },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0, lineWidth: 1 }] },

                            { text: `From which TVA:`, style: ['normal'], bold: 'true', margin: [0, 20, 0, 0] },
                            { text: `TVA 9%: ${this.posCloseFiscalReport.total9Tva.toFixed(2)} $`, style: 'normal' },
                            { text: `TVA 19%: ${this.posCloseFiscalReport.total19Tva.toFixed(2)} $`, style: 'normal', margin: [0, 0, 0, 20] },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0, lineWidth: 1 }] },

                            {
                                text: `Total amount received: ${this.posCloseFiscalReport.totalOrdersValue.toFixed(2)} $`,
                                style: 'subheader',
                                margin: [0, 20, 0, 20],
                                alignment: 'right',
                            },
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

    async generateStockProductsReport(categoryId: number) {
        this.adminService.getStockProductsReportData(categoryId).subscribe({
            next: async (response: any[]) => {
                this.productStockReport = response;
                if (this.productStockReport.length > 0) {
                    this.productStockReport.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    });
                    const productTableBody = [
                        [
                            { text: 'Crt.', style: 'tableHeader' },
                            { text: 'Product Name', style: 'tableHeader' },
                            { text: 'Current stock', style: 'tableHeader' },
                            { text: 'Selling Price', style: 'tableHeader' },
                            { text: 'Tva', style: 'tableHeader' },
                            { text: 'Stock limit', style: 'tableHeader' },
                            { text: 'Stock value', style: 'tableHeader' },
                        ],
                    ];

                    this.productStockReport.forEach((product,index) => {
                        productTableBody.push([
                            { text: `${index+1}`, style: '' },
                            { text: `${product.name}`, style: '' },
                            { text: `${product.currentStock} ${product.uniteMeasure}`, style: '' },
                            { text: `${product.unit_price} $`, style: '' },
                            { text: `${product.tva}%`, style: '' },
                            { text: `${product.stockLimit}`, style: '' },
                            { text: `${(product.unit_price * product.unit_price).toFixed(2)}$`, style: '' },
                        ]);
                    });

                    const logoBase64 = await this.imageService.convertImageToBase64(
                        '../assets/images/sdbar-high-resolution-logo-black-transparent.png',
                    );
                    const date = new Date();
                    const formattedDate = this.sharedService.convertDateToYYMMDDHHMMSS(date);

                    const docDefinition: any = {
                        content: [
                            { image: logoBase64, width: 70, height: 40, alignment: 'left' },
                            { text: 'Stock Products Report', style: 'header', margin: [0, 10, 0, 20], alignment: 'center' },
                            { text: `Category name: ${this.productStockReport[1].categoryName}`, style: 'normal', alignment: '' },
                            { text: `Created date: ${formattedDate}`, style: 'normal', margin: [0, 0, 0, 20] },
                            {
                                style: 'table',
                                table: {
                                    widths: [30,100, 90, 80, 35, 70, 80],
                                    body: productTableBody,
                                },
                            },
                        ],
                        styles: {
                            header: { fontSize: 30, bold: 'true' },
                            normal: { fontSize: 16, bold: 'false', margin: [0, 5, 0, 5] },
                            tableHeader: { bold: true, fontSize: 14, color: 'black' },
                            table: { margin: [0, 5, 0, 15] },
                        },
                    };
                    pdfMake.createPdf(docDefinition).open();
                }
                //console.log(this.productStockReport);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    async generateEarningsBetweenDatesPdf(report: PosClosedReport) {
        const logoBase64 = await this.imageService.convertImageToBase64('../assets/images/sdbar-high-resolution-logo-black-transparent.png');
        const today = new Date();
        const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(today);
        const startDate = this.sharedService.convertDateToDDMMYY(report.createdAt);
        const endDate = this.sharedService.convertDateToDDMMYY(report.forDay);

        const pageSize = {
            width: 500,
            height: auto as any,
        };

        const docDefinition: any = {
            pageSize: pageSize,
            content: [
                { image: logoBase64, width: 50, height: 30, alignment: 'right' },
                { text: 'REPORT: Earnings ', style: ['header', 'center'] },
                { text: `Created date: ${createdAt}`, style: 'normal' },
                { text: `Date period: ${startDate} - ${endDate}`, style: 'normal' },
                { text: `Finished Orders: ${report.finishedOrdersCounter}`, style: 'subheader' },
                { text: `Canceled Orders: ${report.canceledOrdersCounter}`, style: 'subheader' },
                { text: `Total earnings: ${report.totalOrdersValue.toFixed(2)} $`, style: 'header', alignment: 'center', margin: [0, 20, 0, 0] },
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

    async generateSupplyProducts() {
        this.adminService.getSupplyCheckProducts().subscribe({
            next: async (response: any) => {
                this.supplyProducts = response;
                if (this.supplyProducts.length > 0) {
                    const productTableBody = [
                        [
                            { text: 'Nr.', style: 'tableHeader' },
                            { text: 'Product Name', style: 'tableHeader' },
                            { text: 'Current stock', style: 'tableHeader' },
                            { text: 'Limit stock', style: 'tableHeader' },
                        ],
                    ];

                    this.supplyProducts.forEach((product, index) => {
                        productTableBody.push([
                            { text: `${index + 1}`, style: '' },
                            { text: `${product.productName}`, style: '' },
                            { text: `${product.productAvailability}`, style: '' },
                            { text: `${product.productSupplyCheck}`, style: '' },
                        ]);
                    });

                    const logoBase64 = await this.imageService.convertImageToBase64(
                        '../assets/images/sdbar-high-resolution-logo-black-transparent.png',
                    );
                    const date = new Date();
                    const formattedDate = this.sharedService.convertDateToYYMMDDHHMMSS(date);

                    const docDefinition: any = {
                        content: [
                            { image: logoBase64, width: 70, height: 40, alignment: 'left' },
                            { text: 'Report', style: 'header', margin: [0, 10, 0, 10], alignment: 'center' },
                            { text: 'Low stock products', style: 'header', margin: [0, 10, 0, 20], alignment: 'center' },
                            { text: `Created date: ${formattedDate}`, style: 'normal', margin: [0, 0, 0, 20] },
                            {
                                style: 'table',
                                table: {
                                    widths: [30, '*', '*', '*'],
                                    body: productTableBody,
                                },
                            },
                        ],
                        styles: {
                            header: { fontSize: 30, bold: 'true' },
                            normal: { fontSize: 16, bold: 'false', margin: [0, 5, 0, 5] },
                            tableHeader: { bold: true, fontSize: 14, color: 'black' },
                            table: { margin: [0, 5, 0, 15] },
                        },
                    };
                    pdfMake.createPdf(docDefinition).open();
                } else {
                    this.sharedService.showNotification(true, 'Good news', 'There are 0 products that need supply!');
                }
            },
            error: (e) => {
                this.sharedService.showNotification(false, 'Error', 'Cannot get data!');
            },
        });
    }

    async generateOrdersBetweenTwoDates(start: Date, end: Date) {
        const stringStart = this.sharedService.convertDateToYYMMDD(start);
        const stringEnd = this.sharedService.convertDateToYYMMDD(end);
        //console.log(stringEnd);
        //console.log(stringStart);

        this.adminService.getOrderDetails(stringStart, stringEnd).subscribe({
            next: async (response: any) => {
                this.ordersDetails = response.map((order: OrderDetailsDto) => {
                    return {
                        orderId: order.orderId,
                        orderDate: new Date(order.orderDate),
                        orderStatus: order.orderStatus,
                        clientName: order.clientName,
                        takenBy: order.takenBy,
                        delieveredBy: order.delieveredBy,
                        tableId: order.tableId,
                        orderValue: order.orderValue,
                        products: order.products,
                    };
                });
                if (this.ordersDetails.length > 0) {
                    const ordersTableBody = [
                        [
                            { text: 'Id.', style: 'tableHeader' },
                            { text: 'Order date', style: 'tableHeader' },
                            { text: 'Status', style: 'tableHeader' },
                            { text: 'Client', style: 'tableHeader' },
                            { text: 'Taken by', style: 'tableHeader' },
                            { text: 'Delievered by', style: 'tableHeader' },
                            { text: 'Table', style: 'tableHeader' },
                            { text: 'Total', style: 'tableHeader' },
                        ],
                    ];
                    this.ordersDetails.sort((a: OrderDetailsDto, b: OrderDetailsDto) => {
                        return b.orderDate.valueOf() - a.orderDate.valueOf();
                    });

                    this.ordersDetails.forEach((order, index) => {
                        let orderDate = this.sharedService.convertDateToYYMMDDHHMMSS(order.orderDate);
                        let clientName = 'Unknown';
                        if (order.clientName != '') {
                            clientName = order.clientName;
                        }
                        let takenBy = 'Unknown';
                        if (order.takenBy != '') {
                            takenBy = order.takenBy;
                        }
                        let delieveredBy = 'Unknown';
                        if (order.delieveredBy != '') {
                            delieveredBy = order.delieveredBy;
                        }
                        let table = 'Bar';
                        if (order.tableId != null) {
                            table = order.tableId.toString();
                        }
                        ordersTableBody.push([
                            { text: `${order.orderId}`, style: '' },
                            { text: `${orderDate}`, style: '' },
                            { text: `${order.orderStatus}`, style: '' },
                            { text: `${clientName}`, style: '' },
                            { text: `${takenBy}`, style: '' },
                            { text: `${delieveredBy}`, style: '' },
                            { text: `${table}`, style: '' },
                            { text: `${order.orderValue.toFixed(2)}$`, style: '' },
                        ]);
                    });

                    const logoBase64 = await this.imageService.convertImageToBase64(
                        '../assets/images/sdbar-high-resolution-logo-black-transparent.png',
                    );
                    const date = new Date();
                    const formattedDate = this.sharedService.convertDateToYYMMDDHHMMSS(date);

                    const docDefinition: any = {
                        pageOrientation: 'landscape',
                        content: [
                            { image: logoBase64, width: 70, height: 40, alignment: 'left' },
                            { text: 'Report: orders', style: 'header', margin: [0, 10, 0, 10], alignment: 'center' },
                            { text: `Created date: ${formattedDate}`, style: 'normal', margin: [0, 0, 0, 20] },
                            { text: `Date period: ${stringStart} - ${stringEnd}`, style: 'normal', margin: [0, 0, 0, 20] },
                            { text: `Total orders: ${this.ordersDetails.length}`, style: 'normal', margin: [0, 0, 0, 20] },
                            {
                                style: 'table',
                                table: {
                                    widths: [40, 140, 60, 60, 140, 140, 45, '*'],
                                    body: ordersTableBody,
                                },
                            },
                        ],
                        styles: {
                            header: { fontSize: 30, bold: 'true' },
                            normal: { fontSize: 16, bold: 'false', margin: [0, 5, 0, 5] },
                            tableHeader: { bold: true, fontSize: 14, color: 'black' },
                            table: { margin: [0, 5, 0, 15] },
                        },
                    };
                    pdfMake.createPdf(docDefinition).open();
                } else {
                    this.sharedService.showNotification(true, 'Empty', 'There are no orders in this period!');
                }
            },
            error: (e) => {
                this.sharedService.showNotification(false, 'Error', 'Something went wrong!');
            },
        });
    }

    async generateUsersDataReport() {
        this.adminService.getClientData().subscribe({
            next: async (response: any) => {
                this.clientsData = response;
                if (this.clientsData.length > 0) {
                    const logoBase64 = await this.imageService.convertImageToBase64(
                        '../assets/images/sdbar-high-resolution-logo-black-transparent.png',
                    );
                    const today = new Date();
                    const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(today);

                    const clientTableBody = [
                        [
                            { text: 'Id', style: 'tableHeader' },
                            { text: 'First Name', style: 'tableHeader' },
                            { text: 'Last Name', style: 'tableHeader' },
                            { text: 'Email', style: 'tableHeader' },
                            { text: 'Phone number', style: 'tableHeader' },
                            { text: 'Finished orders', style: 'tableHeader' },
                            { text: 'Total earnings', style: 'tableHeader' },
                        ],
                    ];
                    this.clientsData.forEach((client, index) => {
                        clientTableBody.push([
                            {
                                text: client.clientId.toString(),
                                style: '',
                            },
                            {
                                text: client.firstName || '',
                                style: '',
                            },
                            {
                                text: client.lastName,
                                style: '',
                            },
                            {
                                text: client.email,
                                style: '',
                            },
                            {
                                text: client.phoneNumber,
                                style: '',
                            },
                            {
                                text: client.ordersCount.toString(),
                                style: '',
                            },
                            {
                                text: ` ${client.ordersValue.toFixed(2).toString()} $`,
                                style: '',
                            },
                        ]);
                    });

                    const docDefinition: any = {
                        pageOrientation: 'landscape',
                        content: [
                            { image: logoBase64, width: 50, height: 30, alignment: 'right' },
                            { text: 'REPORT ', style: ['header', 'center'] },
                            { text: 'Users data ', style: ['header', 'center'] },
                            { text: `Created date: ${createdAt}`, style: 'normal' },
                            { text: 'Clients data', style: 'subheader' },
                            {
                                style: 'table',
                                table: {
                                    widths: [40, 90, 90, '*', 90, 70, 80],
                                    body: clientTableBody,
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
                } else {
                    this.sharedService.showNotification(false, 'No data provided', 'Something went wrong when trying to get the needed data!');
                }
            },
            error: (e: any) => {
                console.log(e);
            },
        });
    }

    async generateReservationReport(start: Date, end: Date) {
        const stringStart = this.sharedService.convertDateToYYMMDD(start);
        const stringEnd = this.sharedService.convertDateToYYMMDD(end);
        this.adminService.getAllReservationsBetweenDates(stringStart, stringEnd).subscribe({
            next: async (response: any[]) => {
                this.allReservations = response.map((reservation) => {
                    return {
                        reservationId: reservation.reservationId,
                        reservationDate: new Date(reservation.reservationdate),
                        guestNumber: reservation.guestNumber,
                        firstName: reservation.firstName,
                        lastName: reservation.lastName,
                        phoneNumber: reservation.phoneNumber,
                        reservationStatus: reservation.reservationStatus,
                        duration: reservation.duration,
                        tableNumber: reservation.tableNumber,
                    };
                });
                if (this.allReservations.length > 0) {
                    this.allReservations.sort((a, b) => {
                        return new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime();
                    });
                    const logoBase64 = await this.imageService.convertImageToBase64(
                        '../assets/images/sdbar-high-resolution-logo-black-transparent.png',
                    );
                    const today = new Date();
                    const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(today);

                    const reservationTableBody = [
                        [
                            { text: 'Id', style: 'tableHeader' },
                            { text: 'Date', style: 'tableHeader' },
                            { text: 'Guest number', style: 'tableHeader' },
                            { text: 'First Name', style: 'tableHeader' },
                            { text: 'Last Name', style: 'tableHeader' },
                            { text: 'Phone number', style: 'tableHeader' },
                            { text: 'Status', style: 'tableHeader' },
                            { text: 'Duration', style: 'tableHeader' },
                            { text: 'Table number', style: 'tableHeader' },
                        ],
                    ];
                    this.allReservations.forEach((reservation, index) => {
                        let reservationStatus;
                        const reservationDate = this.sharedService.convertDateToYYMMDDHHMMSS(reservation.reservationDate);
                        if (reservation.reservationStatus == true) {
                            reservationStatus = 'Confirmed';
                        } else {
                            reservationStatus = 'Unconfirmed';
                        }

                        reservationTableBody.push([
                            {
                                text: reservation.reservationId.toString(),
                                style: '',
                            },
                            {
                                text: reservationDate || '',
                                style: '',
                            },
                            {
                                text: reservation.guestNumber.toString(),
                                style: '',
                            },
                            {
                                text: reservation.firstName,
                                style: '',
                            },
                            {
                                text: reservation.lastName,
                                style: '',
                            },
                            {
                                text: reservation.phoneNumber,
                                style: '',
                            },
                            {
                                text: reservationStatus,
                                style: '',
                            },
                            {
                                text: ` ${reservation.duration.toString()} hours`,
                                style: '',
                            },
                            {
                                text: ` ${reservation.tableNumber.toString()}`,
                                style: '',
                            },
                        ]);
                    });

                    const docDefinition: any = {
                        pageOrientation: 'landscape',
                        content: [
                            { image: logoBase64, width: 50, height: 30, alignment: 'right' },
                            { text: 'REPORT ', style: ['header', 'center'] },
                            { text: 'Reservations data ', style: ['header', 'center'] },
                            { text: `Created date: ${createdAt}`, style: 'normal' },
                            { text: `Date period: ${stringStart} - ${stringEnd}`, style: 'subheader' },
                            {
                                style: 'table',
                                table: {
                                    widths: [40, 90, 90, 90, 90, 90, 80, 50, 50],
                                    body: reservationTableBody,
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
                } else {
                    this.sharedService.showNotification(false, 'No data', 'There are 0 reservations in that period!');
                }
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    async generateEmployeesReport(report: PosClosedReport) {
        const logoBase64 = await this.imageService.convertImageToBase64('../assets/images/sdbar-high-resolution-logo-black-transparent.png');
        const today = new Date();
        const createdAt = this.sharedService.convertDateToYYMMDDHHMMSS(today);
        const startDate = this.sharedService.convertDateToDDMMYY(report.createdAt);
        const endDate = this.sharedService.convertDateToDDMMYY(report.forDay);

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

        const docDefinition: any = {
            content: [
                { image: logoBase64, width: 50, height: 30, alignment: 'right' },
                { text: 'REPORT: Employees orders ', style: ['header', 'center'] },
                { text: `Created date: ${createdAt}`, style: 'normal' },
                { text: `Date period: ${startDate} - ${endDate}`, style: 'normal' },
                { text: 'Employees Orders', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*'],
                        body: employeesTableBody,
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
}
