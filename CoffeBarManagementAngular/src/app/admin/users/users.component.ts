import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service.service';
import { GetClientDataDto } from '../../shared/models/getClientsDataDto';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { SharedService } from '../../shared/shared.service';

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
