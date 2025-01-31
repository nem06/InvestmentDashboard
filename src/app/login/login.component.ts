import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockApiService } from '../stock-api.service';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent { 
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private apiService:StockApiService, private appComp:AppComponent) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {    
      this.apiService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
        (response) => {
          localStorage.setItem('InvestmentauthToken', response.accesstoken);
          this.appComp.callAfterLogin()
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          if(error.status === 401){
            const passwordControl = this.loginForm.get('password');
            passwordControl?.setErrors({ wrongPassword: true });
          }
        }
      );
    }
  }
}
