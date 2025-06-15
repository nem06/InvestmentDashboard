import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { StockApiService } from '../stock-api.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mf-view',
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './mf-view.component.html',
  styleUrl: './mf-view.component.css'
})
export class MfViewComponent {

  owners: any[] = [];
  data: any;
  minDate: any = null;
  maxDate: any = null;
  purchaseYears: number[] = [];
  purchaseYear: number = 0;
  mfList: any[] = [];
  filteredData: any;
  groupBy: string = "year";
  sortField: string = 'period';
  sortFieldType: string = 'period';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortBy: string = 'percentage';
  selectedOwner = 0;
  mfMetaData: any;
  yearList: number[] = [];
  monthList: string[] = [];
  selectedYear: number | null = 0;
  selectedMonth: string | null = 'all';

  inputJson: {
      group_by: string,
      start_date: string | null,
      end_date: string | null,
      mfid: number[],
      ownerid: number[]
  } = {
      group_by: "year",
      start_date: null,
      end_date: null,
      mfid: [],
      ownerid: []
  }
selectedMFs: any[] = [];


  constructor(private sharedService: SharedService, private router: Router, private apiService: StockApiService) { }
  

  ngOnInit(): void {
    this.callAPI();
    this.apiService.getMfMetadata().subscribe(data => {
      console.log('Mutual Funds metadata received:', data);
      this.mfMetaData = data;
      this.minDate = data.MinPurchaseDate;
      this.maxDate = data.MaxPurchaseDate;
      const minYear = new Date(this.minDate).getFullYear();
      const maxYear = new Date(this.maxDate).getFullYear();
      this.purchaseYears = [];
      for (let year = minYear; year <= maxYear; year++) {
        this.purchaseYears.push(year);
      }
      this.owners = data.Owners.map((owner: any) => ({
        name: owner.name,
        id: owner.ownerid
      }));
      this.mfList = data.Owners.flatMap((owner: any) =>
        (owner.mutualfunds && Array.isArray(owner.mutualfunds))
          ? owner.mutualfunds.map((mf: any) => ({
          name: mf.MutualFund,
          id: mf.MFId
        }))
          : []
      ).sort((a: any, b: any) => a.name.localeCompare(b.name));
      console.log("Mutual Funds Metadata:", this.mfList);
    }, error => {
      console.error('Error fetching Mutual Funds metadata:', error);
    });
  }

  onPurchaseYearChange(py: number) {
    this.purchaseYear = py;
    if (py === 0) {
      this.inputJson.start_date = null;
      this.inputJson.end_date = null;
      this.callAPI();
    }
    else if (py === -1) {
      
    } 
    else {
      this.inputJson.start_date = '' + py + '-01-01';
      this.inputJson.end_date = '' + py + '-12-31';
      this.callAPI();
    }

  }

  onDateChange() {
    this.inputJson.start_date = this.minDate;
    this.inputJson.end_date = this.maxDate;
    this.callAPI();
  }

  onOwnerFilter(ownerId:number){
    this.selectedOwner = ownerId;
    this.inputJson.ownerid = ownerId === 0 ? [] : [ownerId];
    if (ownerId === 0) {
      this.mfList = this.mfMetaData.Owners.flatMap((owner: any) =>
      (owner.mutualfunds && Array.isArray(owner.mutualfunds))
        ? owner.mutualfunds.map((mf: any) => ({
          name: mf.MutualFund,
          id: mf.MFId
        }))
        : []
      ).sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else {
      const owner = this.mfMetaData.Owners.find((o: any) => o.ownerid === ownerId);
      this.mfList = owner && owner.mutualfunds && Array.isArray(owner.mutualfunds)
      ? owner.mutualfunds.map((mf: any) => ({
        name: mf.MutualFund,
        id: mf.MFId
        })).sort((a: any, b: any) => a.name.localeCompare(b.name))
      : [];
    }
    this.callAPI();
  }

  toggleMFSelection() {
    console.log("Selected MFs: ", this.selectedMFs);
    this.inputJson.mfid = this.selectedMFs;
    this.callAPI();
  }

  onGroupBy(type:string){
    this.groupBy = type;
    this.inputJson.group_by = type;
    this.callAPI();
    if(type === 'year')
      this.onYearFilter(0);
    else if(type === 'month')
      this.onMonthFilter('all');
    else if(type === 'week')
      this.onYearFilter(0);
    else if(type === 'day'){
      this.selectedYear = 0;
      this.onMonthFilter('all');
      this.onYearFilter(this.selectedYear || 0);
    }
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

  convertYMString(period: string): string {
    const match = period.match(/^Y(\d{4})M(\d{2})$/);
    if (!match) return period;
    const year = match[1].substring(2, 4); // Get last two digits of the year
    const monthNum = parseInt(match[2], 10);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[monthNum - 1] || '';
    return `${month} '${year}`;
  }

  getMonthName(period: string): string {
    const match = period.match(/^Y(\d{4})M(\d{2})$/);
    if (!match) return period;
    const monthNum = parseInt(match[2], 10);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[monthNum - 1] || '';
    return month;
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
  }

  callAPI(){
    this.apiService.getDynamicReturnView(this.inputJson).subscribe(data => {
      console.log('Dynamic return view received:', data);
      this.data = data;
      this.filteredData = data;
      this.sortOrder = 'asc'; 
      this.sortData('period'); 
      this.yearList = [...new Set(data.map((item: any) => Number(item.dateyear)))] as number[];
      this.monthList = [...new Set(data.map((item: any) => item.ym))] as string[];
    }, error => {
      console.error('Error fetching Dynamic return view data:', error);
    });
  }

  sortData(field: string | null) {
    if (!this.filteredData || !Array.isArray(this.filteredData)) return;

    if (field === 'period') {
      this.sortFieldType = 'period';
      switch (this.groupBy) {
        case 'year': this.sortField = 'dateyear'; break;
        case 'month': this.sortField = 'ym'; break;
        case 'week': this.sortField = 'yw'; break;
        case 'day': this.sortField = 'date'; break;
      }
    }
    else if (field === 'return' && this.sortBy === 'percentage') {
      this.sortFieldType = 'return';
      this.sortField = 'period_return_per';
    }
     else if (field === 'return' && this.sortBy === 'amount') {
      this.sortFieldType = 'return';
      this.sortField = 'period_return';
    }
    else if (field === 'overall' && this.sortBy === 'percentage') {
      this.sortFieldType = 'overall';
      this.sortField = 'cumulative_return_per';
    }
     else if (field === 'overall' && this.sortBy === 'amount') {
      this.sortFieldType = 'overall';
      this.sortField = 'cumulative_return';
    }
    else if (field === null){
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      if (this.sortField.endsWith('_per')) {
        this.sortField = this.sortField.replace('_per', '');
      } else if (this.sortField.endsWith('return')) {
        this.sortField = this.sortField + '_per';
      }
      console.log("Sort field set to: " + this.sortField);
    }

    // Toggle sort order
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    const order = this.sortOrder;

    this.filteredData.sort((a: any, b: any) => {
      if (a[this.sortField] < b[this.sortField]) return order === 'asc' ? -1 : 1;
      if (a[this.sortField] > b[this.sortField]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onYearFilter(year: number) {
    this.selectedYear = year;
     if(year === 0) {
        this.filteredData = this.data;
     }
     else{
        this.filteredData = this.data.filter((item: any) => item.dateyear === this.selectedYear);
     }
    this.selectedMonth = 'all';
    this.monthList = [...new Set(this.filteredData.map((item: any) => item.ym))] as string[];
  }

  onMonthFilter(month: string) {
    this.selectedMonth = month;
    if(month == 'all'){
      this.filteredData = this.data.filter((item: any) => item.dateyear === this.selectedYear);
      this.selectedMonth = 'all';
    }
    else{
      this.filteredData = this.data.filter((item: any) => item.dateyear === this.selectedYear && item.ym === this.selectedMonth);
    }
  }
}
