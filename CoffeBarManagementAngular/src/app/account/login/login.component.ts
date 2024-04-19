import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { SharedService } from '../../shared/shared.service';
import { take } from 'rxjs';
import { User } from '../../shared/models/user';
import { Roles } from '../../../dependencies/roles';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  isSubmited: boolean = false;
  errorMessage?: string;
  showPassword: boolean = false;
  faEye = faEye;
  faEyeClosed = faEyeSlash;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private roles: Roles
  ) {
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

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisible() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.isSubmited = true;
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: (response) => {
          switch (this.accountService.getUserRole()) {
            case this.roles.Admin1: {
              this.router.navigateByUrl('/dashboard');
              break;
            }
            case this.roles.Client1: {
              this.router.navigateByUrl('/');
              break;
            }
            case this.roles.Employee1: {
              this.router.navigateByUrl('/menu');
              break;
            }
          }
        },
        error: (error) => {
          this.sharedService.showNotification(
            false,
            error.error.value.title,
            error.error.value.message
          );
        },
      });
    }
  }
}
