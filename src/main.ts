import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Chart } from 'chart.js/auto';
import  ChartDataLabels from 'chartjs-plugin-datalabels';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

Chart.register(ChartDataLabels);