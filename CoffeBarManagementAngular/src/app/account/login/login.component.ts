import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup = new FormGroup({});
  isSubmited: boolean = false;
  errorMessage?:string;

  constructor(private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ){}
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required]],
      password: ['',[Validators.required]]
    })
  }

  login(){
    this.isSubmited = true;
    if(this.loginForm.valid){
      this.accountService.login(this.loginForm.value).subscribe({
        next: (response) => {
        },
        error: (error) => {
          this.sharedService.showNotification(false,error.error.value.title, error.error.value.message)
          this.loginForm.reset();
        }
      });
    }
    
  }
}
