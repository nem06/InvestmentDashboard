import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedService } from './shared.service';
import { StockApiService } from './stock-api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InvestmentDashboard';
  alwaysRun : any;

  constructor(private sharedService:SharedService, private apiService: StockApiService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('InvestmentauthToken');
    if (token) {
      console.log('Token found, calling callAfterLogin...');
      this.callAfterLogin();
    } else {
      console.warn('No token found, redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  updateData(data: any, currentStocks:any){
    this.sharedService.LiveDataObject = data;    
    
    currentStocks.forEach((user: any) => {
      let dayReturn = 0;
      let totalReturn = 0;
      let currentValue = 0;
      user.Symbol.forEach((symbol:any) => {
        const liveSymbol = data.find((sym: { Symbol: string; }) => sym.Symbol === symbol.Symbol);
        if(liveSymbol){
          symbol.CurrentRate = liveSymbol.Current.toFixed(2);
          symbol.CurrentValue = (symbol.Total_Qty * liveSymbol.Current).toFixed(0);
          symbol.Day_Rate_Change = liveSymbol.DayChange.toFixed(0);
          symbol.Day_Rate_Change_P = liveSymbol.DayChangePercent.toFixed(2);
          symbol.Day_Change = (symbol.Total_Qty * liveSymbol.DayChange).toFixed(0);
          symbol.TotalReturn = (symbol.CurrentValue - symbol.Investment).toFixed(0);
          symbol.TotalReturn_P = (symbol.TotalReturn*100/symbol.Investment).toFixed(2);
          symbol.Purchases.forEach((pur:any)=>{
            pur.TotalReturn = (pur.Qty * (liveSymbol.Current - pur.Buy)).toFixed(2);
            pur.TotalReturn_P = ((liveSymbol.Current - pur.Buy)*100/pur.Buy).toFixed(2);
          });
          currentValue += parseInt(symbol.CurrentValue);
          dayReturn += parseInt(symbol.Day_Change);
          totalReturn += parseInt(symbol.TotalReturn);
        }
        else{
          console.log(symbol.Symbol)
          currentValue += parseInt(symbol.CurrentValue);
          dayReturn += parseInt(symbol.Day_Change);
          totalReturn += parseInt(symbol.TotalReturn);
        }
        
      })
      user.Day_Change = dayReturn;
      user.TotalReturn = totalReturn;
      user.CurrentValue = currentValue;
      user.Day_Change_P = ((user.CurrentValue - user.CurrentValueStatic)*100/user.CurrentValueStatic).toFixed(2);
      user.TotalReturn_P = ((user.CurrentValue - user.Investment)*100/user.Investment).toFixed(2);
    });
    this.sharedService.StocksObject = currentStocks
    console.log("Live Data Updated")
  }

  callAfterLogin(){
    console.log('Calling callAfterLogin...');
    this.getMutualFundsData();  
    setInterval(() => this.getMutualFundsData(), 300000);

    this.apiService.getLatestJson("Stocks").subscribe(data => {
      console.log('Stocks data received:', data);
      this.sharedService.StocksObject  = data;
    }, error => {
      console.error('Error fetching Stocks data:', error);
    });

    this.getLiveData()
    this.alwaysRun = setInterval(() => this.getLiveData(), 7000);

  }

  getMutualFundsData(){
    this.apiService.getLatestJson("MutualFunds").subscribe(data => {
      console.log('MutualFunds data received:', data);
      this.sharedService.MutualFundsObject = data;
    }, error => {
      console.error('Error fetching MutualFunds data:', error);
    });
  }

  getLiveData(){
    this.sharedService.LiveDataStatusObject = true
    this.apiService.getLiveData().subscribe(async data => {
      this.sharedService.LiveDataObject = data;
      let currentStocks = this.sharedService.getCurrentStocks();
      if(currentStocks == null){
        await this.delay(500);
        currentStocks = this.sharedService.getCurrentStocks();
      }

      if(!data[0].Date.toString().includes('T')){
        this.sharedService.LiveDataStatusObject = false
        clearInterval(this.alwaysRun)
        if(currentStocks[0].MaxDate == data[0].Date)
          return;
      }
      this.updateData(data, currentStocks)

    });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
