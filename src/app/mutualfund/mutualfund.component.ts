import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedService} from '../shared.service';
import { Router } from '@angular/router';
import { StockApiService } from '../stock-api.service';
import { FormsModule } from '@angular/forms';
import { LineChartComponent } from "../line-chart/line-chart.component";

@Component({
  selector: 'app-mutualfund',
  imports: [CommonModule, FormsModule, LineChartComponent],
  templateUrl: './mutualfund.component.html',
  styleUrl: './mutualfund.component.css'
})
export class MutualfundComponent {
  isExpanded:boolean = false;
  data: any;
  expandProgress = false
  startDate: any = '2024-03-01';
  endDate: any = '2025-05-25';
  asOn: any = '2025-05-29';

  constructor(private sharedService:SharedService, private router:Router, private apiService:StockApiService) {}

  ngOnInit(): void {
    this.sharedService.MutualFundsObject$.subscribe(
      (mutualFunds:any) => {
        if(mutualFunds){
          this.data = mutualFunds;  
          this.asOn = mutualFunds.MaxDate;
          this.startDate = mutualFunds.MinPurchaseDate;
          this.endDate = mutualFunds.MaxPurchaseDate;

          this.apiService.getDailyMFReturns().subscribe((response:any) => {
              console.log("Daily MF Returns Response:", response); 
              this.data.SingleNodes[0].DailyReturns = response;
              this.data.SingleNodes[0].FilteredDailyReturns = response; 
              this.data.SingleNodes[0].FilteredDailyReturns_30D = response?.slice(-30);
              this.data.SingleNodes[0].FilteredDailyReturns_3M = this.filterByMonths(response, 3);
              this.data.SingleNodes[0].FilteredDailyReturns_6M = this.filterByMonths(response, 6);
              this.data.SingleNodes[0].FilteredDailyReturns_12M = this.filterByMonths(response, 12);
              this.data.SingleNodes[0].GraphView = 'D30'
            });

          this.data.UserNodes.forEach((user:any) => {
            this.apiService.getDailyMFReturns(user.Name).subscribe((response:any) => {
              console.log("Daily MF Returns Response:", response); 
              user.DailyReturns = response; 
              user.FilteredDailyReturns = response; 
              user.FilteredDailyReturns_30D = response?.slice(-30);
              user.FilteredDailyReturns_3M = this.filterByMonths(response, 3);
              user.FilteredDailyReturns_6M = this.filterByMonths(response, 6);
              user.FilteredDailyReturns_12M = this.filterByMonths(response, 12);
              user.GraphView = 'D30'
            });  
          });

        }    
      }
    );

    // const inputJson = {"as_on":this.asOn,"start_date":this.startDate,"end_date":this.endDate}

    // this.apiService.getMFByDate(inputJson).subscribe(data => {
    //   console.log('MutualFunds data by date received:', data);
    //   this.data = data;
    // }, error => {
    //   console.error('Error fetching MutualFunds data:', error);
    // });

  }

  private filterByMonths(data: any[], months: number): any[] {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    return (data ?? []).filter(d =>
      new Date(d.date) >= cutoff
    );
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
  }

  expandDayOverview(name: string, operation: string) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    if(!this.expandProgress){
      this.expandProgress = true;
      if(operation === 'open' || (operation === 'close' && !user.isExpandedDay)) 
        user.isExpandedDay = true;
      else if(operation === 'close') 
        user.isExpandedDay = false;
      setTimeout(() => {
        this.expandProgress = false;
      }, 100);
    }
  }

  expandOverall(name: string, operation: string) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    if(!this.expandProgress){
      this.expandProgress = true;
      if(operation === 'open' || (operation === 'close' && !user.isExpandedAll)) 
        user.isExpandedAll = true;
      else if(operation === 'close') 
        user.isExpandedAll = false;
      setTimeout(() => {
        this.expandProgress = false;
      }, 100);
    }
  }

  expandMutualFund(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isExpanded = !mf.isExpanded;
   
  }

  expandMutualFundDaily(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isExpandedDaily = !mf.isExpandedDaily;
  }

  expandMutualFundOverView(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isExpandedOverview = !mf.isExpandedOverview;

    this.apiService.getNAVs({mfid: MFId}).subscribe((response:any) => {
      mf.NAVs = response;
    });

    mf.PurchaseDates = mf.Purchase
      .map((p: any) => p.PurchaseDate ?? null)
      .filter((d: any) => d !== null);

    mf.SellDates = []
  }

  togglePurchase(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isPurchaseShow = !mf.isPurchaseShow;
  }

  formatToLacs(num: number): string {
    if (num >= 100000) {
        return (num / 100000).toFixed(2) + " L";
    }
    else if( num >= 10000){
      return (num/1000).toFixed(2) + " K";
    }
    else{
      return num.toString();
    }
  }

  onDateChange() {
    const inputJson = {"as_on":this.asOn,"start_date":this.startDate,"end_date":this.endDate}

    this.apiService.getMFByDate(inputJson).subscribe(data => {
      console.log('MutualFunds data by date received:', data);
      this.data = data;
    }, error => {
      console.error('Error fetching MutualFunds data:', error);
    });
  }
}
