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
  agoString: string = '';

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

    setInterval(() => this.getLiveString(), 1000);
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

  getLiveString() {
    const dateVal = this.liveData?.[0]?.Date;

    // handle numeric timestamps or ISO/date strings
    const date = typeof dateVal === 'number' || /^\d+$/.test(String(dateVal))
      ? new Date(Number(dateVal))
      : new Date(dateVal);

    if (isNaN(date.getTime())) this.agoString = '';

    const diffMs = Date.now() - date.getTime();
    if (diffMs < 1000) this.agoString = '0s ago';

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) this.agoString = `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) this.agoString = `${minutes}min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours > 0)
      this.agoString = `${hours}h ago`;

  }

  logout(){
    localStorage.removeItem('InvestmentauthToken')
    this.router.navigate(['/login'])
  }

  navigateLive(){
    this.router.navigate(['/live'])
  }
}
