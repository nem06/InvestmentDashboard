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
    console.log('AppComponent ngOnInit');
    // fetch('latestReturns.json')
    //   .then(response => response.json())
    //   .then(data => {
    //     this.sharedService.MutualFundsObject = data; 
    //     console.log(this.sharedService.MutualFundsObject); 
    //   })
    //   .catch(error => {
    //     console.error('Error fetching JSON:', error);
    //   });

     this.apiService.getLatestJson("MutualFunds").subscribe(data => {
        this.sharedService.MutualFundsObject = data;
        console.log(this.sharedService.MutualFundsObject);
      });

      this.apiService.getLatestJson("Stocks").subscribe(data => {
        this.sharedService.StocksObject = data;
        console.log(this.sharedService.StocksObject);
      });
  }
}
