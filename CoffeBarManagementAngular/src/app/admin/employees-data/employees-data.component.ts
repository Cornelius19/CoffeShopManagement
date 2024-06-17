import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AdminService } from '../admin-service.service';

@Component({
    selector: 'app-employees-data',
    templateUrl: './employees-data.component.html',
    styleUrl: './employees-data.component.css',
})
export class EmployeesDataComponent implements OnInit {
    constructor(private adminService: AdminService) {}

    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();

    ngOnInit(): void {
      this.getEmployeesData();
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
    }

    getEmployeesData(){
      
    }
}
