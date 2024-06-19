import { Component, OnInit } from '@angular/core';
import { Register } from '../shared/models/register';
import { AccountService } from '../account/account.service';
import { SharedService } from '../shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../shared/validators/password-match';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { ChangePassword } from '../shared/models/changePassword';

@Component({
    selector: 'app-account-details',
    templateUrl: './account-details.component.html',
    styleUrl: './account-details.component.css',
})
export class AccountDetailsComponent implements OnInit {
    constructor(private accountService: AccountService, private sharedService: SharedService, private formBuilder: FormBuilder) {}
    userDetails: Register = {} as Register;
    showPassword1: boolean = false;
    showPassword2: boolean = false;
    showPassword3: boolean = false;
    faEye = faEye;
    faEyeClosed = faEyeSlash;
    changePasswordForm: FormGroup = new FormGroup({});
    submitted: boolean = false;

    ngOnInit(): void {
        this.getUserDetails();
        this.initializeForm();
    }
    initializeForm() {
        this.changePasswordForm = this.formBuilder.group(
            {
                currentPassword: ['', [Validators.required]],
                password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$')]],
                repassword: ['', [Validators.required]],
            },
            { validators: passwordMatchValidator },
        );
    }

    togglePasswordVisible(number: number) {
        switch (number) {
            case 1:
                this.showPassword1 = !this.showPassword1;

                break;

            case 2:
                this.showPassword2 = !this.showPassword2;

                break;
            case 3:
                this.showPassword3 = !this.showPassword3;

                break;
        }
    }

    getUserDetails() {
        const userId = this.sharedService.getUserId();
        const role = this.accountService.getUserRole()
        if (userId && role) {
            this.accountService.getUserDetails(userId,role).subscribe({
                next: (response: any) => {
                    this.userDetails = response;
                },
                error: (e) => {
                    console.log(e);
                },
            });
        }
    }

    changePassword() {
        this.submitted = true;
        const userId = this.sharedService.getUserId();
        if(this.changePasswordForm.valid && userId){
          const model : ChangePassword = this.changePasswordForm.value;
          this.accountService.changePassword(userId,model).subscribe({
            next: (response:any) => {
              this.sharedService.showNotification(true,'Success',response.value.message);
              this.changePasswordForm.reset();
            },
            error:(e:any) => {
              this.sharedService.showNotification(false,'Success',e.error.value.message);
              
            }
          });
        }
    }
}
