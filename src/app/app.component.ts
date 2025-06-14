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
    this.apiService.getLatestJson("MutualFunds").subscribe(data => {
      console.log('MutualFunds data received:', data);
      this.sharedService.MutualFundsObject = data;
    }, error => {
      console.error('Error fetching MutualFunds data:', error);
    });

  this.apiService.getLatestJson("Stocks").subscribe(data => {
      console.log('Stocks data received:', data);
      this.sharedService.StocksObject  = data;
    }, error => {
      console.error('Error fetching Stocks data:', error);
    });

  this.apiService.getLatestJson("LiveData").subscribe(data => {
      console.log('LiveData received:', data);
      if(Object.keys(data).length != 0){
        this.sharedService.LiveDataObject = data;
        let currentStocks = this.sharedService.getCurrentStocks();
        if(currentStocks)
          this.updateData(data, currentStocks);
        else{
          setTimeout(()=>{
            currentStocks = this.sharedService.getCurrentStocks();
            this.updateData(data, currentStocks);
          },500)
        }
        this.sharedService.LiveDataStatusObject = true

        const alwayRun = setInterval(() => {
          this.apiService.getLatestJson("LiveData").subscribe(data => {
            if(Object.keys(data).length === 0){
              this.apiService.getLatestJson("ClosedData").subscribe(data => {
                this.sharedService.LiveDataObject = data;
                this.sharedService.LiveDataStatusObject = false
                let currentStocks = this.sharedService.getCurrentStocks();
                this.updateData(data, currentStocks)
              });
              clearInterval(alwayRun)
              return
            }
            let currentStocks = this.sharedService.getCurrentStocks();
            this.updateData(data, currentStocks)
          });
  
        }, 7000);

      }
      else{
        this.apiService.getLatestJson("ClosedData").subscribe(data => {
          this.sharedService.LiveDataObject = data;
          this.sharedService.LiveDataStatusObject = false
        });
      }
        
    }, error => {
      console.error('Error fetching LiveData:', error);
    });
  }
}
