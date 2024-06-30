import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { Roles } from '../../../dependencies/roles';
import { Config } from 'datatables.net';
import { AdminService } from '../admin-service.service';
import { StockProducts } from '../../shared/models/stockProducts';
import { Subject } from 'rxjs';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { SharedService } from '../../shared/shared.service';
import { ProductComponent } from '../../shared/models/productComponent';
import { GetComponentProducts } from '../../shared/models/getComponentProducts';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-stock-products',
    templateUrl: './stock-products.component.html',
    styleUrl: './stock-products.component.css',
})
export class StockProductsComponent implements OnInit {
    constructor(
        router: Router,
        accountService: AccountService,
        roles: Roles,
        private adminService: AdminService,
        private sharedService: SharedService,
    ) {}

    faTrashCan = faTrashCan;
    faEdit = faEdit;
    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();
    stockProducts: StockProducts[] = [];

    ngOnInit(): void {
        this.getStock();
        this.dtOptions = {
            pagingType: 'full_numbers',
            lengthMenu: [
                [10, 50, 100, -1],
                [10, 50, 100, 'All'],
            ],
            order:[1,'asc'],
            scrollY:'500'
        };
    }

    getStock() {
        this.adminService.getStock().subscribe({
            next: (response: any) => {
                this.stockProducts = response;
                this.dtTrigger.next(null);
                //console.log(this.stockProducts);
            },
            error: (error) => {
                console.log(error);
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
        XLSX.writeFile(wb, 'Orders.xlsx');
    }

    createNonComplexProduct() {
        this.adminService.showAddNewNonComplexProduct();
    }


    modifyComplexProduct(
        productId: number,
        name: string,
        unitPrice: number,
        unitMeasure: string,
        availableForUser: boolean,
        complexProduct: boolean,
        categoryId: number,
        quantity: number,
        supplyCheck: number,
        tva: number,
        componentProducts: GetComponentProducts[],
        modifyStatus: boolean
    ) {
        this.adminService.showModifyComplexProduct(
            productId,
            name,
            unitPrice,
            unitMeasure,
            availableForUser,
            complexProduct,
            categoryId,
            quantity,
            supplyCheck,
            tva,
            componentProducts,
            modifyStatus
        );
    }


    createComplexProduct() {
        this.adminService.showAddNewComplexProduct();
    }

    modifyProduct(
        productId: number,
        name: string,
        unitPrice: number,
        unitMeasure: string,
        availableForUser: boolean,
        complexProduct: boolean,
        categoryId: number,
        quantity: number,
        supplyCheck: number,
        tva: number,
    ) {
        this.adminService.showModifyProduct(
            productId,
            name,
            unitPrice,
            unitMeasure,
            availableForUser,
            complexProduct,
            categoryId,
            quantity,
            supplyCheck,
            tva
        );
    }
    deleteProduct(productId: number) {}
}
