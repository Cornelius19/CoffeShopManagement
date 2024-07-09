import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service.service';
import { StockBalanceDto } from '../../shared/models/stockBalanceDto';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { BalanceCategories } from '../../shared/models/balanceCategories';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-stock-balance-data',
    templateUrl: './stock-balance-data.component.html',
    styleUrl: './stock-balance-data.component.css',
})
export class StockBalanceDataComponent implements OnInit {
    stockBalanceData: StockBalanceDto[] = [];
    productCategories: BalanceCategories[] = [];
    removeCategory: string = '';

    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.getStockBalanceData();
        this.getRemoveCategories();
        this.dtOptions = {
            pagingType: 'full_numbers',
            lengthMenu: [
                [10, 50, 100, -1],
                [10, 50, 100, 'All'],
            ],
            order: [2, 'desc'],
            scrollY: '500',
        };
        console.log(this.removeCategory);
    }

    getRemoveCategories() {
        this.adminService.getBalanceCategories().subscribe({
            next: (response: any) => {
                this.productCategories = response;
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    getStockBalanceData() {
        this.adminService.getStockBalanceData().subscribe({
            next: (response: any) => {
                this.stockBalanceData = response.map((obj: StockBalanceDto) => {
                    return {
                        stockBalanceDate: new Date(obj.stockBalanceDate),
                        productName: obj.productName,
                        removedQuantity: obj.removedQuantity,
                        categoryName: obj.categoryName,
                    };
                });
                this.dtTrigger.next(null);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    exportToExcel() {
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'StockBalance.xlsx');
    }
}
