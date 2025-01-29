import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private stocksSubject = new BehaviorSubject<any>(null);
  get StocksObject$() {
    return this.stocksSubject.asObservable(); 
  }
  set StocksObject(stocks: any) {
    this.stocksSubject.next(stocks);
  }
  getCurrentStocks() {
    return this.stocksSubject.getValue();
  }

  private mfSubject = new BehaviorSubject<any>(null);
  get MutualFundsObject$() {
    return this.mfSubject.asObservable(); 
  }
  set MutualFundsObject(stocks: any) {
    this.mfSubject.next(stocks);
  }

  private liveDataSubject = new BehaviorSubject<any>(null);
  get LiveDataObject$() {
    return this.liveDataSubject.asObservable(); 
  }
  set LiveDataObject(stocks: any) {
    this.liveDataSubject.next(stocks);
  }
}