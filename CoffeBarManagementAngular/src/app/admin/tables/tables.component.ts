import { Component, OnInit } from '@angular/core';
import { faTrashCan, faEdit } from '@fortawesome/free-regular-svg-icons';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MenuService } from '../../menu/menu.service';
import { GetCategories } from '../../shared/models/getCategories';
import { AdminService } from '../admin-service.service';
import { PosService } from '../../employeeModule/pos/pos.service';
import { SharedService } from '../../shared/shared.service';
import { GetTables } from '../../shared/models/getTables';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {
    constructor(private menuService: MenuService, public adminService: AdminService, private sharedService: SharedService) {}

    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();
    allTables: GetTables[] = [];
    faTrashCan = faTrashCan;
    faEdit = faEdit;

    ngOnInit(): void {
        this.getTables();
        this.dtOptions = {
            pagingType: 'full_numbers',
            lengthMenu: [
                [10, 50, 100, -1],
                [10, 50, 100, 'All'],
            ],
            order:[2,'desc'],
            scrollY:'500'
        };
    }

    getTables() {
        this.sharedService.getAllTables().subscribe({
            next: (response: any) => {
                this.allTables = response;
                this.dtTrigger.next(null);
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
        XLSX.writeFile(wb, 'Tables.xlsx');
    }

    async deleteTable(tableId: number) {
        if (confirm('Are you 100% sure about this?')) {
            this.adminService.deleteTable(tableId).subscribe({
                next: (response: any) => {
                    this.sharedService.showNotificationAndReload(true, 'Delete successfully', response.value.message, true);
                },
                error: (e: any) => {
                    this.sharedService.showNotification(true, 'Delete successfully', e.error.value.message);
                },
            });
        }
    }
}
