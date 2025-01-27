import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StockApiService {

  constructor(private http: HttpClient) { }

  getLatestJson(type: string): Observable<any> {
    return this.http.get(
      "https://stock-node-server.onrender.com/api/test?type="+ type
    );
  }

}
