import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StockApiService } from '../stock-api.service';
import { SharedService } from '../shared.service';
import { LineChartComponent } from "../line-chart/line-chart.component";

@Component({
  selector: 'app-sold-stocks',
  imports: [CommonModule, LineChartComponent],
  templateUrl: './sold-stocks.component.html',
  styleUrl: './sold-stocks.component.css'
})
export class SoldStocksComponent {

  data:any;
  financialYears: any[] = [];
  selectedYear: any;

  constructor(private router: Router, private stockAPI:StockApiService, private sharedService: SharedService) {}

  ngOnInit(): void {
    let startYear = 2024;
    let currentYear = new Date().getFullYear();

    this.financialYears.push({ label: "ALL", startDate: '2023-04-01', endDate: '2999-03-31' });
    for (let y = startYear; y <= currentYear; y++) {
      let startDate = `${y}-04-01`; // 1st April
      let endDate = `${y + 1}-03-31`; // 31st March next year
      let label = `${y}-${(y + 1).toString().slice(-2)}`;

      this.financialYears.push({ label, startDate, endDate });
    }

    this.getData('2023-01-01', '2999-12-31');
    this.selectedYear = "ALL";
    
  }

  expandList(name: string){
    const user = this.data.userData.find((user: { Name: string; }) => user.Name === name);
    user.isExpanded = !user.isExpanded;
  }

  stockExpand(user: any, stock: any){
    const tuser = this.data.userData.find((users: { Name: string; }) => users.Name === user.Name);
    const tstock = tuser.Stocks.find((s: { Symbol: string; }) => s.Symbol === stock.Symbol);

    tstock.isExpanded = !tstock.isExpanded;
    if(!tuser.isExpanded)
      this.expandList(user.Name);

    if(tstock.isExpanded && !tstock.pricesFetched){
      tstock.pricesFetched = true;
      
      // const purchaseDates = (tstock.Purchase ?? [])
      //   .map((p: any) => p.PurchaseDate ?? null)
      //   .filter((d: any) => d !== null);
      // const sellDates = (tstock.Purchase ?? [])
      //   .map((s: any) => s.SellDate ?? null)
      //   .filter((d: any) => d !== null);
      // tstock.SellDates = sellDates;
      // tstock.PurchaseDates = purchaseDates;

      let data = { owner: user.Name, symbol: tstock.Symbol };
      this.stockAPI.getStockPrices(data).subscribe((response:any) => {
        tstock.prices = response;
      });

      this.stockAPI.getStockDates(data).subscribe((response:any) => {
        tstock.SellDates = response.sellDates;
        tstock.PurchaseDates = response.purchaseDates;
      });
    }
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
  }

  getData(startDate: string, endDate: string){
      let inputDates = {
        start_date : startDate,
        end_date : endDate
      }

      this.data = this.stockAPI.getSoldStocks(inputDates)

      this.stockAPI.getSoldStocks(inputDates).subscribe(data => {
        console.log('Sold stocks data received:', data);
        this.data = {userData: data};
      }, error => {
        console.error('Error fetching Sold stocks data:', error);
      });
  }

  onFinancialYearChange(year: any) {
    this.selectedYear = year.label;
    this.getData(year.startDate, year.endDate);
  }
}
