import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddCategory } from '../../../shared/models/addCategory';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin-service.service';

@Component({
  selector: 'app-modified-employee-modal',
  templateUrl: './modified-employee-modal.component.html',
  styleUrl: './modified-employee-modal.component.css'
})
export class ModifiedEmployeeModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder,private adminService: AdminService, private sharedService: SharedService) {}
  isSubmitted: boolean = false;
  formGroup: FormGroup = new FormGroup({});

  employeeId:number = 0;
  salary:number = 0;
  role:string = '';
  ngOnInit(): void {
    this.initializeForm();
  }


  initializeForm(){
    this.formGroup = this.formBuilder.group({
      employeeId: [this.employeeId, [Validators.required]],
      salary: [this.salary, [Validators.required,Validators.min(1)]],
      role: [this.role, [Validators.required]],
    });
  }

  modifyEmployee(){
    this.isSubmitted = true;
    if(this.formGroup.valid){
      const model: Object = this.formGroup.value;
      this.adminService.modifyEmployeeData(model).subscribe({
        next:(response:any) => {
          this.bsModalRef.hide();
          this.sharedService.showNotificationAndReload(true,'Success',response.value.message,true);
        },
        error: e => {
          console.log(e);
        }
      });
      
    }
  }



}
