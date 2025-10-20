import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { max } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  imports: [NgChartsModule],
  template:`<div> <canvas #lineCanvas>  </canvas> </div>`,
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent {
  @Input() chartDataList: { date: Date; close: number }[] = [];
  @Input() purchaseDates: Date[] = [];
  @Input() sellDates: Date[] = [];
  @ViewChild('lineCanvas', { static: false }) lineCanvas!: ElementRef<HTMLCanvasElement>;

  labels = this.chartDataList.map(d => d.date);
  values = this.chartDataList.map(d => d.close);
  chart: null | Chart = null;

  ngOnInit() {
    this.renderChart();
  }

  renderChart() {
    if (!this.lineCanvas) return;
    const ctx = this.lineCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const maxClose = this.getDateOfMaxClose();
    const minClose = this.getDateOfMinClose();
    this.chart = new Chart(ctx, {
      type: 'line', // ✅ force line chart type
      data: {
        labels: this.labels,
        datasets: [
          {
            label: '',
            data: this.values,
            borderColor: 'gray',
            fill: false,          // no area fill
            tension: 0,           // straight line
            pointRadius: this.labels.map(l =>
              this.purchaseDates.includes(l) || this.sellDates.includes(l) || l == maxClose || l == minClose ? 4 : 0 // 👈 bigger for highlighted points
            ),
            pointBackgroundColor: this.labels.map(l => {
              if(this.purchaseDates.includes(l))
                 return '#1cf5dbff';
              else if(this.sellDates.includes(l)) 
                return '#53f347ff';
              else if(l == maxClose)
                 return 'blue'; 
              else if(l == minClose)
                 return 'red'; 
              else
                   return 'transparent';
            }),
            pointHoverRadius: 2,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { 
          legend: { display: false },
          tooltip: { enabled: true },
          datalabels: { display: false }, // disable value labels },
        },
        scales: {
          x: {
            display: false, // ❌ hides all X-axis labels and lines
            grid: { display: false },
          },
          y: {
            display: false, // ❌ hides Y-axis labels and grid lines
          },
        },
      },
    });
  }

  ngOnChanges() {
    if (!this.chartDataList || this.chartDataList.length === 0) {
      return;
    }
    this.labels = this.chartDataList.map(d => d.date);
    this.values = this.chartDataList.map(d => d.close);
    setTimeout(() => {
      this.renderChart()
    }, 100);
  }

  getDateOfMaxClose(): Date | null {
    if (!this.chartDataList || this.chartDataList.length === 0) return null;
    const maxItem = this.chartDataList.reduce((best, current) =>
      current.close > best.close ? current : best,
      this.chartDataList[0]
    );
    return maxItem.date;
  }

  getDateOfMinClose(): Date | null {
    if (!this.chartDataList || this.chartDataList.length === 0) return null;
    const minItem = this.chartDataList.reduce((best, current) =>
      current.close < best.close ? current : best,
      this.chartDataList[0]
    );
    return minItem.date;
  }
}