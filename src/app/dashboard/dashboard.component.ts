import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { expand } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isExpanded:boolean = false;
  data: any;
  expandProgress = false

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

  expandDayOverview(name: string, operation: string) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    if(!this.expandProgress){
      this.expandProgress = true;
      if(operation === 'open' || (operation === 'close' && !user.isExpandedDay)) 
        user.isExpandedDay = true;
      else if(operation === 'close') 
        user.isExpandedDay = false;
      setTimeout(() => {
        this.expandProgress = false;
      }, 100);
    }
  }

  expandOverall(name: string, operation: string) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    if(!this.expandProgress){
      this.expandProgress = true;
      if(operation === 'open' || (operation === 'close' && !user.isExpandedAll)) 
        user.isExpandedAll = true;
      else if(operation === 'close') 
        user.isExpandedAll = false;
      setTimeout(() => {
        this.expandProgress = false;
      }, 100);
    }
  }
}
