import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InvestmentDashboard';

  constructor(private sharedService:SharedService) {}

  ngOnInit(): void {
    console.log('AppComponent ngOnInit');
    fetch('latestReturns.json')
      .then(response => response.json())
      .then(data => {
        this.sharedService.MutualFundsObject = data; 
        console.log(this.sharedService.MutualFundsObject); 
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });
  }
}
