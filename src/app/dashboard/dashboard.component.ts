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

    if (dateVal) {
      let parsed: Date;
      const s = String(dateVal).trim();
      const isNumeric = typeof dateVal === 'number' || /^\d+$/.test(s);
      const dateOnlyMatch = s.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})$/);

      if (isNumeric) {
        parsed = new Date(Number(dateVal));
      } 
      else if (dateOnlyMatch) {
        // date-only string (e.g. "2025-11-30" or "2025/11/30") -> treat as GMT date at 10:00 AM
        const year = Number(dateOnlyMatch[1]);
        const month = Number(dateOnlyMatch[2]) - 1;
        const day = Number(dateOnlyMatch[3]);
        parsed = new Date(Date.UTC(year, month, day, 10, 0, 0));
      } 
      else {
        parsed = new Date(dateVal);
      }

      // parsed is already in local timezone — use it directly
      const diffMsAlt = Date.now() - parsed.getTime();

      if (diffMsAlt < 1000) { this.agoString = '0s ago'; return; }

      const secondsAlt = Math.floor(diffMsAlt / 1000);
      if (secondsAlt < 60) { this.agoString = `${secondsAlt}s ago`; return; }

      const minutesAlt = Math.floor(secondsAlt / 60);
      if (minutesAlt < 60) { this.agoString = `${minutesAlt}min ago`; return; }

      const hoursAlt = Math.floor(minutesAlt / 60);
      if (hoursAlt > 0) { this.agoString = `${hoursAlt}h ago`; return; }

      this.agoString = '';
      return;

    }
  }

  logout(){
    localStorage.removeItem('InvestmentauthToken')
    this.router.navigate(['/login'])
  }

  navigateLive(){
    this.router.navigate(['/live'])
  }
}
