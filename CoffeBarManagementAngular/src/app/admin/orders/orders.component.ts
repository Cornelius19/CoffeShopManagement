import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service.service';
import { OrderDetailsDto } from '../../shared/models/orderDetailsDto';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { OrderProduct } from '../../shared/models/orderProduct';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
    constructor(private adminService: AdminService) {}
    orders: OrderDetailsDto[] = [];
    dtOptions: Config = {};
    all: number = 999999999;
    dtTrigger: Subject<any> = new Subject<any>();
    faCircleInfo = faCircleInfo;
    ngOnInit(): void {
        this.getAllOrders();
        this.dtOptions = {
            pagingType: 'full_numbers',
            lengthMenu: [
                [10, 50, 100, -1],
                [10, 50, 100, 'All'],
            ],
            order:[2,'desc'],
            scrollY:'500'
        };
    }

    getAllOrders() {
        this.adminService.getOrderDetails('1900-01-01', '1900-01-01').subscribe({
            next: (response: any) => {
                this.orders = response.map((order: OrderDetailsDto) => {
                    return {
                        orderId: order.orderId,
                        orderDate: new Date(order.orderDate),
                        orderStatus: order.orderStatus,
                        clientName: order.clientName,
                        takenBy: order.takenBy,
                        delieveredBy: order.delieveredBy,
                        tableId: order.tableId,
                        orderValue: order.orderValue,
                        products: order.products,
                    };
                });
                this.dtTrigger.next(null);
            },
        });
    }

    exportToExcel() {
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'Orders.xlsx');
    }

    showDetails(products: OrderProduct[]) {
        this.adminService.showOrderProductsModal(products);
    }
}
