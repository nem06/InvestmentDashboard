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

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      "https://stock-node-server.onrender.com/api/login", 
      { "username":email, "password":password, "AccessToken":"" },
    );
  }

}
