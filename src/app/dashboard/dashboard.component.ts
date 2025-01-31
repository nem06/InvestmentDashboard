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
  liveData:any;
  liveDataStatus: any;

  constructor(private router: Router,  private sharedService: SharedService) {}

  ngOnInit(){
    console.log("redirected")
   this.sharedService.MutualFundsObject$.subscribe(
      (mutualFunds:any) => {
        this.mutualFunds = mutualFunds;  
      });
    this.sharedService.StocksObject$.subscribe(
      (stocks:any) => {
        this.stocks = stocks; 
      });
    this.sharedService.LiveDataObject$.subscribe(
      (liveData:any) => {
      this.liveData = liveData; 
    });
    this.sharedService.LiveDataStatusObject$.subscribe(
      (liveDataStatus:any) => {
      this.liveDataStatus = liveDataStatus; 
    });
  }


  navigateMututalFund(){
    this.router.navigate(['/mutualfund']);
  }

  navigateStocks(){
    this.router.navigate(['/stocks']);
  }

  formatToLacs(num: number): string {
    if (num >= 100000) {
        return (num / 100000).toFixed(2) + " L";
    }
    return num.toString();
  }

  logout(){
    localStorage.removeItem('InvestmentauthToken')
    this.router.navigate(['/login'])
  }
  navigateLive(){
    this.router.navigate(['/live'])
  }
}
