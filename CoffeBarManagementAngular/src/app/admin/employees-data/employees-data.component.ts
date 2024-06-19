import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AdminService } from '../admin-service.service';
import { GetEmployeeDataDto } from '../../shared/models/getEmployeeDataDto';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { SharedService } from '../../shared/shared.service';


@Component({
    selector: 'app-employees-data',
    templateUrl: './employees-data.component.html',
    styleUrl: './employees-data.component.css',
})
export class EmployeesDataComponent implements OnInit {
    constructor(public adminService: AdminService, private sharedService:SharedService) {}

    faEdit = faEdit;
    faLock = faLock;
    faUnlock= faUnlock;
    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();
    employeeData : GetEmployeeDataDto [] = [];

    ngOnInit(): void {
      this.getEmployeesData();
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
    }

    getEmployeesData(){
      this.adminService.getEmployeeData().subscribe({
        next: (response:any) => {
          this.employeeData = response;
          this.dtTrigger.next(null);
          console.log(this.employeeData);
          
          
        },
        error: e => {
          console.log(e);
        }
      });
    }

    lockUnlockEmployee(employeeId: number,status:boolean){
      this.adminService.lockUnlockEmployee(employeeId,status).subscribe({
        next: (response:any) => {
          this.sharedService.showNotificationAndReload(true,'Lock status changed',response.value.message,true);
        }
      });
    }
    
}
