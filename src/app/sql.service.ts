import { Injectable } from '@angular/core';
import initSqlJs from 'sql.js';


@Injectable({
  providedIn: 'root'
})
export class SqlService {

  constructor() { }

  async getDb() {
    const SQL = await initSqlJs();
    const db = new SQL.Database();
    return db;
  }

  
}
