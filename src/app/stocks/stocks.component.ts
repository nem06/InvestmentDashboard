import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StockApiService } from '../stock-api.service';

@Component({
  selector: 'app-stocks',
  imports: [CommonModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  // @Input() stockList: any;
  stockList:any;
  totalDayRet = 0
  totalRet = 0
  constructor(private router: Router, private stockAPI:StockApiService) {}

  ngOnInit(): void {

    
      this.getStockPrices();
      setInterval(() => {
        this.getStockPrices();
      }, 30000);
  }

  setIP(){
    this.router.navigate(['/ip-manager']);
  }

  getStockPrices(){
    fetch('stocks-list.json')
      .then(response => response.json())
      .then(data => {
        this.stockList = data; 
        console.log(this.stockList); 
        let tickerList = '';

      this.stockList.forEach((stock:any) => {
        if(!tickerList.includes(stock.name))
          tickerList += stock.name + '.NS,';
      });
      console.log(tickerList);
      tickerList = tickerList.slice(0, -1);
      this.stockAPI.getStockPrices(tickerList).subscribe((response:any) => {
          console.log(response);
          this.totalDayRet = 0
          this.totalRet = 0
          this.stockList.forEach((stock:any) => {
            const st = response.find((s:any) => s.name === stock.name);
            stock.current_price = st.current_price;
            stock.change = st.change;
            stock.change_pr = st.change_pr;
            stock.day_high = st.day_high;
            stock.day_low = st.day_low;
            stock.day_ret = st.change * stock.qty;
            stock.total_ret = (st.current_price - stock.buy) * stock.qty;
            this.totalDayRet += stock.day_ret;
            this.totalRet += stock.total_ret;
        });
      });
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });

      
      
      
  }
}
