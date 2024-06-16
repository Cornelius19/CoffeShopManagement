import { Component, OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js';

@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrl: './dashboard1.component.css',
})
export class Dashboard1Component implements OnInit {

  constructor() {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Series A',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Series B',
            data: [28, 48, 40, 19, 86, 27, 90],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}