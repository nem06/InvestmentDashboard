import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedService } from './shared.service';
import { StockApiService } from './stock-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InvestmentDashboard';

  constructor(private sharedService:SharedService, private apiService: StockApiService) {}

  ngOnInit(): void {

     this.apiService.getLatestJson("MutualFunds").subscribe(data => {
        this.sharedService.MutualFundsObject = data;
      });

      this.apiService.getLatestJson("Stocks").subscribe(data => {
        console.log(data)
        this.sharedService.StocksObject  = data;
      });

      this.apiService.getLatestJson("LiveData").subscribe(data => {
        if(Object.keys(data).length != 0)
          this.sharedService.LiveDataObject = data;
      });

      const alwayRun = setInterval(() => {
        this.apiService.getLatestJson("LiveData").subscribe(data => {
          if(Object.keys(data).length === 0){
            clearInterval(alwayRun)
            return
          }
            this.sharedService.LiveDataObject = data;
        
            const currentStocks = this.sharedService.getCurrentStocks();
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

            // this.sharedService.StocksObject  = currentStocks;
            console.log("currentStocks updated")
        });

      }, 7000);
  }
}
