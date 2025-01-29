import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  mutualFunds: any;
  stocks: any;

  constructor(private router: Router,  private sharedService: SharedService) {}

  ngOnInit(){
   this.sharedService.MutualFundsObject$.subscribe(
      (mutualFunds:any) => {
        this.mutualFunds = mutualFunds;  
      });
    this.sharedService.StocksObject$.subscribe(
      (stocks:any) => {
        this.stocks = stocks; 
      });
  }


  navigateMututalFund(){
    this.router.navigate(['/mutualfund']);
  }

  navigateStocks(){
    this.router.navigate(['/stocks']);
  }
}
