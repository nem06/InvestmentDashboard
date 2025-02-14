import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedService} from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mutualfund',
  imports: [CommonModule],
  templateUrl: './mutualfund.component.html',
  styleUrl: './mutualfund.component.css'
})
export class MutualfundComponent {
  isExpanded:boolean = false;
  data: any;
  expandProgress = false

  constructor(private sharedService:SharedService, private router:Router) {}

  ngOnInit(): void {
    this.sharedService.MutualFundsObject$.subscribe(
      (mutualFunds:any) => {
        this.data = mutualFunds;  
      });
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
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

  expandMutualFund(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isExpanded = !mf.isExpanded;

  }

  expandMutualFundDaily(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isExpandedDaily = !mf.isExpandedDaily;
  }

  expandMutualFundOverView(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isExpandedOverview = !mf.isExpandedOverview;
  }

  togglePurchase(name:string, MFId: number) {
    const user = this.data.UserNodes.find((user: { Name: string; }) => user.Name === name);
    const mf = user.MutualFunds.find((mf: { MFId: number; }) => mf.MFId === MFId);
    mf.isPurchaseShow = !mf.isPurchaseShow;
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
}
