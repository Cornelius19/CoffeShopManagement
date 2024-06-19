import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../shared/validators/password-match';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { NotExpr } from '@angular/compiler';
import { User } from '../../shared/models/user';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup = new FormGroup({});
    submitted = false;
    errorMesseges: string[] = []; //all error messeges from backend
    showPassword1: boolean = false;
    showPassword2: boolean = false;
    faEye = faEye;
    faEyeClosed = faEyeSlash;

    constructor(
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
        private router: Router,
    ) {
        //this part of code is to restrict access to the register component in case the user is already logged in it also appear in the login page
        this.accountService.user$.pipe(take(1)).subscribe({
            next: (user: User | null) => {
                if (user) {
                    this.router.navigateByUrl('/');
                }
            },
        });
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    togglePasswordVisible(number: number) {
        switch (number) {
            case 1:
                this.showPassword1 = !this.showPassword1;
                break;
            case 2:
                this.showPassword2 = !this.showPassword2;
                break;
        }
    }

    initializeForm() {
        this.registerForm = this.formBuilder.group(
            {
                firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
                lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
                email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
                phoneNumber: ['', [Validators.required, Validators.pattern('^\\+40[1-9][0-9]{8,9}$')]],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$'),
                        Validators.maxLength(30),
                    ],
                ],
                repassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
            },
            { validators: passwordMatchValidator },
        );
    }

    register() {
        this.submitted = true;
        this.errorMesseges = [];

        if (this.registerForm.valid) {
            //subscribe is there because register frunction from accounservice returns an observabale object
            this.accountService.register(this.registerForm.value).subscribe({
                next: (response: any) => {
                    this.sharedService.showNotification(true, response.value.title, response.value.message);
                    this.router.navigateByUrl('/account/login');
                },
                error: (error: any) => {
                    this.sharedService.showNotification(false, error.error.value.title, error.error.value.message);
                    console.log(error);
                    this.registerForm.reset();
                },
            });
        }
    }
}
