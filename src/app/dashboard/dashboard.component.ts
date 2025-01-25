import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  mutualFunds: any;

  constructor(private router: Router, private sharedService:SharedService) {}


  ngOnInit(){
    this.mutualFunds = this.sharedService.MutualFundsObject;
    if(this.mutualFunds === undefined || this.mutualFunds === null){
      setTimeout(() => {
        this.mutualFunds = this.sharedService.MutualFundsObject;
      }, 1000);
    }
  }


  navigateMututalFund(){
    this.router.navigate(['/mutualfund']);
  }
  
}
