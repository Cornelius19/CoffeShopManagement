import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '../admin-service.service';
import { OrdersStatisticsByMonth } from '../../shared/models/Reports/ordersByMonthsStatistics';
import { CurrencyPipe } from '@angular/common';
import { EmployeesOrdersDay } from '../../shared/models/PosReport/EmployeesOrdersDay';
import { OrderStatistics } from '../../shared/models/Reports/orderStatistics';
import { TableOrders } from '../../shared/models/Reports/tablesOrders';

@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrl: './dashboard1.component.css',
})
export class Dashboard1Component implements OnInit {
    constructor(private adminService: AdminService) {
        // Register Chart.js components
        Chart.register(...registerables);
    }

    ordersStatistics: OrdersStatisticsByMonth[] = [];
    months: string[] = [];
    names: string[] = [];
    tablesId: string[] = [];
    tableOrdersCounter: number[] = [];
    takenOrders: number[] = [];
    delieveredOrders: number[] = [];
    ordersCounter: number[] = [];
    ordersValue: number[] = [];
    employeeOrders: EmployeesOrdersDay[] = [];
    tableOrders: TableOrders[] = [];
    orderStatistics: OrderStatistics = {} as OrderStatistics;

    ngOnInit(): void {
        this.getOrdersByMonthStatistics();
        this.getEmployeesOrders();
        this.getOrderStatistics();
        this.getTableOrders();
        //this.createChart();
    }

    createOrdersChart(): void {
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
                        borderWidth: 1,
                    },
                    {
                        label: 'Orders value',
                        data: this.ordersValue,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    createEmployeesChart(): void {
        const ctx = document.getElementById('myChart2') as HTMLCanvasElement;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.names,
                datasets: [
                    {
                        label: 'Taken orders',
                        data: this.takenOrders,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Delievered orders',
                        data: this.delieveredOrders,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    createTableOrdersChart(): void {
        const ctx = document.getElementById('myChart3') as HTMLCanvasElement;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.tablesId,
                datasets: [
                    {
                        data: this.tableOrdersCounter,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
            },
        });
    }

    getOrderStatistics() {
        this.adminService.getOrderStatistics().subscribe({
            next: (response: any) => {
                this.orderStatistics = response;
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getOrdersByMonthStatistics() {
        this.adminService.getOrdersByMonthsStatistic().subscribe({
            next: (response: any) => {
                this.ordersStatistics = response;
                this.ordersStatistics.forEach((obj) => {
                    this.months.push(obj.month);
                    this.ordersCounter.push(obj.ordersCounter);
                    this.ordersValue.push(obj.ordersValue);
                });
                this.createOrdersChart();
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getEmployeesOrders() {
        this.adminService.getEmployeesOrders().subscribe({
            next: (response: any) => {
                this.employeeOrders = response;
                //console.log(this.employeeOrders);

                this.employeeOrders.forEach((obj) => {
                    this.names.push(obj.name);
                    this.takenOrders.push(obj.takenOrders);
                    this.delieveredOrders.push(obj.delieveredOrders);
                });
                this.createEmployeesChart();
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getTableOrders() {
        this.adminService.getTablesOrders().subscribe({
            next: (response: any) => {
                this.tableOrders = response;
                this.tableOrders.forEach((item) => {
                    if (item.tableId == 0) {
                        this.tablesId.push(`Bar`);
                        this.tableOrdersCounter.push(item.ordersCounter);
                    } else {
                        this.tablesId.push(`Table ${item.tableId}`);
                        this.tableOrdersCounter.push(item.ordersCounter);
                    }
                });
                this.createTableOrdersChart();
            },
            error: (e) => {
                console.log(e);
            },
        });
    }
}
