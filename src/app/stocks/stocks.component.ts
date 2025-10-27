import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StockApiService } from '../stock-api.service';
import { SharedService } from '../shared.service';
import { NgChartsModule } from 'ng2-charts';
import { LineChartComponent } from "../line-chart/line-chart.component";

@Component({
  selector: 'app-stocks',
  imports: [CommonModule, NgChartsModule, LineChartComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  // @Input() stockList: any;
  data:any;
  livedata:any;
  liveDataStatus:any;
  totalDayRet = 0
  totalRet = 0
  expandProgress = false
  rateListExpanded = false

  constructor(private router: Router, private stockAPI:StockApiService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.StocksObject$.subscribe(
        (stocks:any) => {
        this.data = stocks; 
      });

    this.sharedService.LiveDataObject$.subscribe(
      (liveData:any) => {
      this.livedata = liveData; 
    });

    this.sharedService.LiveDataStatusObject$.subscribe(
      (liveDataStatus:any) => {
      this.liveDataStatus = liveDataStatus; 
    });

    this.stockAPI.getDailyOwnerReturns().subscribe((response:any) => {
      setTimeout(() => {
        console.log("Daily Returns Response:", response);
        this.data.forEach((user:any) => {
          user.DailyReturns = response.find((u:any) => u.owner === user.Name)?.returns || [];
        });
      }, 500);
    })
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
  }

  setIP(){
    this.router.navigate(['/ip-manager']);
  }

  expandUserStockList(name:string){
    const user = this.data.find((s:any) => s.Name === name);
    user.ExpandList = !user.ExpandList;

  }

  toggleRateContainer(){
    this.data[0].rateListExpanded = !this.data[0].rateListExpanded;
  }

  navigateLive(){
    this.router.navigate(['/live'])
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

  expandUser(name:string, operation:string){
    const user = this.data.find((user: { Name: string; }) => user.Name === name);
    if(!this.expandProgress){
      this.expandProgress = true;
      if(operation === 'open' || (operation === 'close' && !user.isExpanded)) 
        user.isExpanded = true;
      else if(operation === 'close') 
        user.isExpanded = false;
      setTimeout(() => {
        this.expandProgress = false;
      }, 100);
    }
  }

  expandStock(name:string, symbol:string){
    
    const user = this.data.find((user: { Name: string; }) => user.Name === name);
    const stock = user.Symbol.find((s: { Symbol: string; }) => s.Symbol === symbol);

    stock.showPurchases = !stock.showPurchases

    if(stock.showPurchases && !stock.pricesFetched){
      stock.pricesFetched = true;
      
      let data = { owner: name, symbol: symbol };
      this.stockAPI.getStockPrices(data).subscribe((response:any) => {
        stock.prices = response;
      });

      this.stockAPI.getStockDates(data).subscribe((response:any) => {
        stock.SellDates = response.sellDates;
        stock.PurchaseDates = response.purchaseDates;
      });
    }
  }

}
