import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StockApiService } from '../stock-api.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-sold-stocks',
  imports: [CommonModule],
  templateUrl: './sold-stocks.component.html',
  styleUrl: './sold-stocks.component.css'
})
export class SoldStocksComponent {

  data:any;

  constructor(private router: Router, private stockAPI:StockApiService, private sharedService: SharedService) {}

  ngOnInit(): void {
    let inputDates = {
      start_date : '2024-01-01',
      end_date : '2025-12-31'
    }
    this.data = this.stockAPI.getSoldStocks(inputDates)

    this.stockAPI.getSoldStocks(inputDates).subscribe(data => {
      console.log('Sold stocks data received:', data);
      this.data = {userData: data};
    }, error => {
      console.error('Error fetching Sold stocks data:', error);
    });
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
  }
}
