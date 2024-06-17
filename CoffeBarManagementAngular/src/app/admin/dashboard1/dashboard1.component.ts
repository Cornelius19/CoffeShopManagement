import { Component, OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js';
import { AdminService } from '../admin-service.service';
import { OrdersStatisticsByMonth } from '../../shared/models/Reports/ordersByMonthsStatistics';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrl: './dashboard1.component.css',
})
export class Dashboard1Component implements OnInit {

  constructor(private adminService:AdminService) {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ordersStatistics: OrdersStatisticsByMonth[] = [];
  months: string[] = [];
  ordersCounter: number[] = [];
  ordersValue: number[] = [];

  ngOnInit(): void {
    this.getOrdersByMonthStatistics();
    //this.createChart();
  }

  createChart(): void {
    let months: string[] = [];
    this.ordersStatistics.forEach((obj) => {
      months.push(obj.month)
    });
    const ctx = document.getElementById('myChart1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.months,
        datasets: [
          {
            label: 'Orders number',
            data: this.ordersCounter,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Orders value',
            data: this.ordersValue,
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


  getOrdersByMonthStatistics(){
    this.adminService.getOrdersByMonthsStatistic().subscribe({
      next: (response:any) => {
        this.ordersStatistics = response;
        this.ordersStatistics.forEach((obj) => {
          this.months.push(obj.month);
          this.ordersCounter.push(obj.ordersCounter);
          this.ordersValue.push(obj.ordersValue);
        });     
        this.createChart();   
      },
      error: e=> {
        console.log(e);
        
      }
    });
  }
}