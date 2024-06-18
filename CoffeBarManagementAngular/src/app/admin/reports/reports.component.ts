import { Component, OnInit, enableProdMode } from '@angular/core';
import { ReportPdfServiceService } from '../../report-pdf-service.service';
import { MenuService } from '../../menu/menu.service';
import { GetCategories } from '../../shared/models/getCategories';
import { SharedService } from '../../shared/shared.service';
import { PosClosedReport } from '../../shared/models/PosReport/PosCloseReport';
import { end } from '@popperjs/core';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
    constructor(public reportService: ReportPdfServiceService, private menuService: MenuService, private sharedService: SharedService) {}

    posClosedReportData: PosClosedReport = {} as PosClosedReport;
    allCategories: GetCategories[] = [];
    categoryId: number = 0;
    dateForPosClosingReport: string = '';
    posClosingStartDate: string = '';
    posClosingEndDate: string = '';
    dateValidation: boolean = false;

    ngOnInit(): void {
        this.getAllCategories();
    }

    getAllCategories() {
        this.menuService.getAllCategories().subscribe({
            next: (response: any) => {
                this.allCategories = response;
            },
        });
    }

    generateStockProductsReport() {
        this.reportService.generateStockProductsReport(this.categoryId);
    }

    getCloseStatusData(date: string) {
        if (date == '') {
            this.sharedService.showNotification(false, 'Error', 'Select a date please!');
        } else {
            this.sharedService.getClosePOSData(this.dateForPosClosingReport).subscribe({
                next: (response: any) => {
                    this.posClosedReportData = {
                        name: response.name,
                        createdAt: new Date(response.createdAt),
                        forDay: new Date(response.forDay),
                        finishedOrdersCounter: response.finishedOrdersCounter,
                        canceledOrdersCounter: response.canceledOrdersCounter,
                        totalOrdersValue: response.totalOrdersValue,
                        employeesOrders: response.employeesOrders,
                        products: response.products,
                    };
                    //console.log(this.posClosedReportData);

                    if (this.posClosedReportData.finishedOrdersCounter != 0) {
                        this.reportService.generateClosePosReportPdf(this.posClosedReportData);
                    } else {
                        this.sharedService.showNotification(false, 'Error', 'There are no orders for today yep');
                    }
                },
                error: (e) => {
                    console.log(e);
                },
            });
        }
    }

    getCloseStatusDataBetweenDates(startDate: string, endDate: string) {
        if (startDate == '' || endDate == '') {
            this.sharedService.showNotification(false, 'Error', 'Select the dates please');
        } else {
            const startDate1 = new Date(startDate);
            const endDate1 = new Date(endDate);
            if (endDate1 < startDate1) {
                this.dateValidation = false;
                this.sharedService.showNotification(false, 'Error', 'Start date is bigger than end date!');
            } else {
                if (endDate1 > new Date() || startDate1 > new Date()) {
                    this.dateValidation = false;
                    this.sharedService.showNotification(false, 'Error', 'One of the dates is in the future!');
                } else {
                    this.dateValidation = true;
                }
            }
        }

        if (this.dateValidation) {
            this.sharedService.getClosePOSDataBetweenDates(startDate, endDate).subscribe({
                next: (response: any) => {
                    this.posClosedReportData = {
                        name: response.name,
                        createdAt: new Date(response.createdAt),
                        forDay: new Date(response.forDay),
                        finishedOrdersCounter: response.finishedOrdersCounter,
                        canceledOrdersCounter: response.canceledOrdersCounter,
                        totalOrdersValue: response.totalOrdersValue,
                        employeesOrders: response.employeesOrders,
                        products: response.products,
                    };
                    //console.log(this.posClosedReportData);

                    if (this.posClosedReportData.finishedOrdersCounter != 0) {
                        this.reportService.generateClosePosReportBetweenDatesPdf(this.posClosedReportData);
                    } else {
                        this.sharedService.showNotification(false, 'Error', 'There are no orders for today yep');
                    }
                },
                error: (e) => {
                    console.log(e);
                },
            });
        }
    }
}
