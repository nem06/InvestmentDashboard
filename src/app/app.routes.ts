import { Routes } from '@angular/router';
import { MutualfundComponent } from './mutualfund/mutualfund.component';
import { IpManagerComponent } from './ip-manager/ip-manager.component';
import { StocksComponent } from './stocks/stocks.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
        { path: '', component: DashboardComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'mutualfund', component: MutualfundComponent },
        { path: 'ip-manager', component: IpManagerComponent },
        { path: 'stocks', component: StocksComponent }
];
