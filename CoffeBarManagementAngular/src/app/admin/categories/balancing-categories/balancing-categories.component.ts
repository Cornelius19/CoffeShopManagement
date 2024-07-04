import { Component, OnInit } from '@angular/core';
import { faTrashCan, faEdit } from '@fortawesome/free-regular-svg-icons';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MenuService } from '../../../menu/menu.service';
import { GetCategories } from '../../../shared/models/getCategories';
import { AdminService } from '../../admin-service.service';
import { BalanceCategories } from '../../../shared/models/balanceCategories';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-balancing-categories',
    templateUrl: './balancing-categories.component.html',
    styleUrl: './balancing-categories.component.css',
})
export class BalancingCategoriesComponent implements OnInit {
    constructor(private menuService: MenuService, private adminService: AdminService) {}

    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();
    productCategories: BalanceCategories[] = [];
    faTrashCan = faTrashCan;
    faEdit = faEdit;

    ngOnInit(): void {
        this.getCategories();
        this.dtOptions = {
            pagingType: 'full_numbers',
            lengthMenu: [
                [10, 50, 100, -1],
                [10, 50, 100, 'All'],
            ],
            order:[1,'asc'],
        };
    }

    getCategories() {
        this.adminService.getBalanceCategories().subscribe({
            next: (response: any) => {
                this.productCategories = response;
                this.dtTrigger.next(null);
                //console.log(this.productCategories);
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
        XLSX.writeFile(wb, 'BalancingCategories.xlsx');
    }

    addNewBalanceCategory() {
        this.adminService.showAddBalanceCategory();
    }

    modifyCategory(categoryId: number, name: string) {
        this.adminService.showModifyBalanceCategory(categoryId, name);
    }

    deleteCategory() {}
}
