import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IpManagerComponent } from './ip-manager/ip-manager.component';
import { StocksComponent } from './stocks/stocks.component';

export const routes: Routes = [
        { path: '', component: DashboardComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'ip-manager', component: IpManagerComponent },
        { path: 'stocks', component: StocksComponent }
];
