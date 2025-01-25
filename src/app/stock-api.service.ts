import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StockApiService {

  constructor(private http: HttpClient) { }

  getStockPrices(tickerList: string): Observable<any> {
    return this.http.get(
      "https://nem-6-dns.duckdns.org:8000/get_stock_data?tickerList="+ tickerList
      
      // "https://" + localStorage.getItem('nem-server-ip') + ':' + localStorage.getItem('nem-server-port') + '/get_stock_data?tickerList='+ tickerList
    );
  }

}
