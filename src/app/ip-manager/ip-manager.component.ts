import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-ip-manager',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ip-manager.component.html',
  styleUrl: './ip-manager.component.css'
})
export class IpManagerComponent { 
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      IP: ['', [Validators.required]],
      Port: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) { 
      localStorage.setItem('nem-server-ip', this.loginForm.value.IP);
      localStorage.setItem('nem-server-port', this.loginForm.value.Port);   
      this.router.navigate(['/stocks']); 
    }
  }
}
