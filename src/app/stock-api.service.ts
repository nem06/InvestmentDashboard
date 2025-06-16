import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StockApiService {

  constructor(private http: HttpClient) { }

  getLatestJson(type: string): Observable<any> {
    const token = localStorage.getItem('InvestmentauthToken') || ''; 
    const headers = new HttpHeaders({
      'Authorization': token
    });
    return this.http.get(
      "https://stock-node-server.onrender.com/api/GetLatestReturns?type="+ type,
      {headers}
    );
  }

   getMFByDate(dates: object): Observable<any> {
    const token = localStorage.getItem('InvestmentauthToken') || ''; 
    const headers = new HttpHeaders({
      'Authorization': token
    });
    
    return this.http.get(
      "https://stock-node-server.onrender.com/api/GetReturnByDate?json="+ JSON.stringify(dates),
      {headers}
    );
  }

  getInvestmentPatternDate(data: object): Observable<any> {
    const token = localStorage.getItem('InvestmentauthToken') || ''; 
    const headers = new HttpHeaders({
      'Authorization': token
    });
    console.log(JSON.stringify(data))
    return this.http.get(
      "https://stock-node-server.onrender.com/api/GetInvestmentPattern?json="+ JSON.stringify(data),
      {headers}
    );
  }

  getDynamicReturnView(data: object): Observable<any> {
    const token = localStorage.getItem('InvestmentauthToken') || ''; 
    const headers = new HttpHeaders({
      'Authorization': token
    });
    console.log(JSON.stringify(data))
    return this.http.get(
      "https://stock-node-server.onrender.com/api/GetReturnView?json="+ JSON.stringify(data),
      {headers}
    );
  }

    getReturnByPeriod(data: object): Observable<any> {
    const token = localStorage.getItem('InvestmentauthToken') || ''; 
    const headers = new HttpHeaders({
      'Authorization': token
    });
    console.log(JSON.stringify(data))
    return this.http.get(
      "https://stock-node-server.onrender.com/api/GetReturnByPeriod?json="+ JSON.stringify(data),
      {headers}
    );
  }

  getMfMetadata(): Observable<any> {
    const token = localStorage.getItem('InvestmentauthToken') || '';
    const headers = new HttpHeaders({
      'Authorization': token
    });
    return this.http.get(
      "https://stock-node-server.onrender.com/api/GetMFMetadata",
      {headers}
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      "https://stock-node-server.onrender.com/api/login", 
      { "username":email, "password":password, "AccessToken":"" },
    );
  }

}
