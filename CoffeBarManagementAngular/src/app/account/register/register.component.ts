import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../../assets/validators/password-match';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMesseges: string[] = []; //all error messeges from backend

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(15),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(15),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$'),
          ],
        ],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^\\+40[1-9][0-9]{8,9}$')],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$'
            ),
            Validators.maxLength(30),
          ],
        ],
        repassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ],
        ],
      },
      { validators: passwordMatchValidator }
    );
  }

  register() {
    this.submitted = true;
    this.errorMesseges = [];

    if (this.registerForm.valid) {
      //subscribe is there because register frunction from accounservice returns an observabale object
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response :any) => {
          this.sharedService.showNotification(true,response.value.title, response.value.message);
          this.router.navigateByUrl('/account/login');
        },
        error: (error: any) => {
          this.sharedService.showNotification(false,error.error.value.title, error.error.value.message);
          console.log(error);
          this.registerForm.reset();
        },
      });
    }
    
  }
}
