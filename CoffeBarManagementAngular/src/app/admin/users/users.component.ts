import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service.service';
import { GetClientDataDto } from '../../shared/models/getClientsDataDto';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
    constructor(private adminService: AdminService,
      private sharedService: SharedService
    ) {}

    clientsData: GetClientDataDto[] = [];
    faEdit = faEdit;
    faLock = faLock;
    faUnlock = faUnlock;
    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();

    ngOnInit(): void {
        this.getClientData();
        this.dtOptions = {
          pagingType: 'full_numbers',
          lengthMenu: [
              [10, 50, 100, -1],
              [10, 50, 100, 'All'],
          ],
          order:[0,'asc'],
          scrollY:'500'
      };
    }

    lockUnlockClients(clientId:number, status:boolean){
      this.adminService.lockUnlockClients(clientId,status).subscribe({
        next: (response:any) => {
          this.sharedService.showNotificationAndReload(true,'Success',response.value.message,true)
        },
        error: e => {
          console.log(e);
        }
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

    getClientData() {
        this.adminService.getClientData().subscribe({
            next: (response: any) => {
                this.clientsData = response;
                this.dtTrigger.next(null);
            },
            error: (e: any) => {
                console.log(e);
            },
        });
    }
}
