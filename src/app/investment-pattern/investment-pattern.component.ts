import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { StockApiService } from '../stock-api.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-investment-pattern',
  imports: [CommonModule, NgChartsModule],
  templateUrl: './investment-pattern.component.html',
  styleUrl: './investment-pattern.component.css'
})
export class InvestmentPatternComponent {
  owners: { name: string; id: number, selected:boolean }[] = [{name: 'NAEEM', id: 1, selected:false}, {name: 'SABERA', id: 2, selected:false}];
  data:any;

  public chartType: 'bar' = 'bar';
  public barChartPlugins = [ChartDataLabels];

  get chartData(): ChartConfiguration<'bar'>['data'] {
    if (!this.data || !Array.isArray(this.data)) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = this.data.map((item: any) => this.convertToMMYY(item.YM));
    const baseInvestment = this.data.map((item: any) => item.sum_investment - item.plus_investment || 0);
    const gain = this.data.map((item: any) => item.plus_investment || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Base',
          data: baseInvestment,
          backgroundColor: 'lightgray',
          stack: 'total'
        },
        {
          label: 'Additional',
          data: gain,
          backgroundColor: 'blue',
          stack: 'total'
        }
      ]
    };
  }


  constructor(private sharedService:SharedService, private router:Router, private apiService:StockApiService) {}
  
  ngOnInit(): void {
    console.log("Investment Pattern Component Initialized");
    const inputJson = {"ownerid":[1,2]}

    this.apiService.getInvestmentPatternDate(inputJson).subscribe(data => {
      console.log('Investment pattern received:', data);
      this.data = data;
    }, error => {
      console.error('Error fetching MutualFunds data:', error);
    });

    let inputJson2 = {
      "group_by": "month",
      "start_date": "2023-01-01",
      "end_date": "2024-12-31",
      "mfid": [],
      "ownerid": []
    }
    this.apiService.getDynamicReturnView(inputJson2).subscribe(data2 => {
      console.log('Dynamic return view received:', data2);
      // this.data = data;
    }, error => {
      console.error('Error fetching Dynamic return view data:', error);
    });

  }

  onOwnerFilter(){
    const selectedOwners = this.owners.filter(owner => owner.selected).map(owner => owner.id);
    if(selectedOwners.length === 0){
      selectedOwners.push(1, 2);
    }
    const inputJson = {"ownerid":selectedOwners}

    this.apiService.getInvestmentPatternDate(inputJson).subscribe(data => {
      console.log('Investment pattern received:', data);
      this.data = data;
    }, error => {
      console.error('Error fetching MutualFunds data:', error);
    });
  }

  convertPeriodString(period: string): string {
    const match = period.match(/^Y(\d{4})M(\d{2})$/);
    if (!match) return period;
    const year = match[1];
    const monthNum = parseInt(match[2], 10);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[monthNum - 1] || '';
    return `${month} ${year}`;
  }

  convertToMMYY(period: string): string {
    const match = period.match(/^Y(\d{4})M(\d{2})$/);
    if (!match) return period;
    const year = match[1].slice(-2);
    const monthNum = parseInt(match[2], 10);
    return `${monthNum}-'${year}`;
  }

  formatToLacs(num: number): string {
    if (num >= 100000) {
        return (num / 100000).toFixed(2) + " L";
    }
    else if( num >= 10000){
      return (num/1000).toFixed(2) + " K";
    }
    else{
      return num.toString();
    }
  }

    formatToLacsGraph(num: number): string {
    if (num >= 100000) {
        return (num / 100000).toFixed(1) + " L";
    }
    else if( num >= 10000){
      return (num/1000).toFixed(1) + " K";
    }
    else{
      return num.toString();
    }
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
  }

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'blue',
        rotation: -75,
        clamp: true,
        clip: false,
        formatter: (value: any, context: any) => {
          const datasets = context.chart.data.datasets;
          const index = context.dataIndex;
          const datasetIndex = context.datasetIndex;
          // Defensive: check if datasets[1] exists
          const total =
            datasets[1] && datasets[1].data[index] !== undefined
              ? (datasets[1].data[index] as number)
              : 0;
          if (datasetIndex === datasets.length - 1) {
            return "+ " + this.formatToLacsGraph(total);
          }
          return '';
        },
        font: {
          weight: 'bold',
          size: 10,
        },
        padding: {
          top: 0
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      legend: {
        display: false
      }
    },
    layout: {
      padding: {
        top: 40
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: false
        },
        grid: {
          display: false
        },
        display: false
        
      }
    },
    // Add onClick event handler
    onClick: (event, elements, chart) => {
      if (elements && elements.length > 0) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const index = element.index;
        // Access your data here
        const label = chart.data.labels ? chart.data.labels[index] : '';
        const value = chart.data.datasets[datasetIndex].data[index];
        // Example: log or call a method
        console.log('Bar clicked:', { label, value, datasetIndex, index });
        // You can call a component method if needed
        // this.onBarClick(label, value, datasetIndex, index);
      }
    }
  };
}
