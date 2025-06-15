import { RouterModule,Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MutualfundComponent } from './mutualfund/mutualfund.component';
import { LoginComponent } from './login/login.component';
import { StocksComponent } from './stocks/stocks.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LiveTilesComponent } from './live-tiles/live-tiles.component';
import { InvestmentPatternComponent } from './investment-pattern/investment-pattern.component';
import { MfViewComponent } from './mf-view/mf-view.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
        { path: 'mutualfund', component: MutualfundComponent, canActivate: [AuthGuard] },
        { path: 'stocks', component: StocksComponent, canActivate: [AuthGuard] },
        { path: 'live', component: LiveTilesComponent, canActivate: [AuthGuard] },
        { path: 'investment-pattern', component: InvestmentPatternComponent, canActivate: [AuthGuard] },
        { path: 'mf-returns', component: MfViewComponent, canActivate: [AuthGuard] },
        { path: '**', redirectTo: 'dashboard' }, 
];
