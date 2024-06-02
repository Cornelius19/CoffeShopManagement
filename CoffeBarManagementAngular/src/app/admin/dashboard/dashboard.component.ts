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

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
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
    public stockProducts: StockProducts[] = [];

    ngOnInit(): void {
        this.getStock();
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
    }

    getStock() {
        this.adminService.getStock().subscribe({
            next: (response: any) => {
                this.stockProducts = response;
                this.dtTrigger.next(null);
                console.log(this.stockProducts);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    generateReport() {
        this.sharedService.showAddNewNonComplexProduct();
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
    ) {
        this.sharedService.showModifyProduct(
            productId,
            name,
            unitPrice,
            unitMeasure,
            availableForUser,
            complexProduct,
            categoryId,
            quantity,
            supplyCheck,
        );
    }
    deleteProduct(productId: number) {}
}
