import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isExpanded:boolean = false;
  data: any;
  tableData = [
    { name: 'Bandhan Small Cap', amount: '₹15,786', percentage: '1.11%' },
    { name: 'Bandhan Small Cap', amount: '₹15,786', percentage: '1.11%' },
    { name: 'Bandhan Small Cap', amount: '₹15,786', percentage: '1.11%' },
    { name: 'Bandhan Small Cap', amount: '₹15,786', percentage: '1.11%' },
    { name: 'Bandhan Small Cap', amount: '₹15,786', percentage: '1.11%' },
    // Add or remove rows dynamically
  ];

  ngOnInit(): void {
    // Use fetch to get the JSON data
    fetch('latestReturns.json')
      .then(response => response.json())
      .then(data => {
        this.data = data; // Assign the data from the JSON file
        console.log(this.data); // You can process the data here
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });
  }

  expandDayOverview(){
    this.isExpanded = !this.isExpanded;
  }
}
