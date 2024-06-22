import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../shared/validators/password-match';
import { AdminService } from '../admin-service.service';
import { RegisterNewEmployeeDto } from '../../shared/models/registerEmployeeDto';
import { SharedService } from '../../shared/shared.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { valHooks } from 'jquery';

@Component({
    selector: 'app-create-new-employee',
    templateUrl: './create-new-employee.component.html',
    styleUrl: './create-new-employee.component.css',
})
export class CreateNewEmployeeComponent implements OnInit {
    constructor(private formBuilder: FormBuilder, private adminService: AdminService, private sharedService: SharedService) {}
    submitted: boolean = false;
    registerForm: FormGroup = new FormGroup({});

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),Validators.maxLength(100)]],
            salary: ['', [Validators.required,Validators.min(0)]],
            password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$')]],
            employeeRole: ['Employee', [Validators.required]],
            repassword: ['', [Validators.required]],
        },
        { validators: passwordMatchValidator });
    }

    registerEmployee() {
      this.submitted = true;
      if(this.registerForm.valid){
        const model : RegisterNewEmployeeDto = {
          firstName: this.registerForm.get('firstName')?.value,
          lastName: this.registerForm.get('lastName')?.value,
          email: this.registerForm.get('email')?.value,
          employeeRole: this.registerForm.get('employeeRole')?.value,
          password: this.registerForm.get('password')?.value,
          salary: this.registerForm.get('salary')?.value,
        }
        this.adminService.registerNewEmployee(model).subscribe({
          next:(response:any) => {
            this.sharedService.showNotification(true,'Success',response.value.message);
            this.registerForm.reset();
            this.submitted = false;
          },
          error: (e:any) => {
            this.sharedService.showNotification(false,'Error',e.error.value.message);
          }
        });
        
      }
    }
}
