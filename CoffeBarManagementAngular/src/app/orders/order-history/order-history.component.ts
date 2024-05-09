import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { SharedService } from '../../shared/shared.service';
import { OrderDto } from '../../shared/models/orderDto';
import { auto } from '@popperjs/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
    constructor(private ordersService: OrdersService, private sharedService: SharedService) {}

    ngOnInit(): void {
        this.getOrderHistory();
    }

    orderHistory: OrderDto[] = [];

    getOrderHistory() {
        const userId = this.sharedService.getUserId();
        if (userId) {
            this.ordersService.getOrderHistory(userId).subscribe({
                next: (response: any) => {
                    this.orderHistory = response;
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }
    }

    generateReceiptPDF(order: OrderDto) {
        let totalSum: number = 0;
        for (let prod of order.products) {
            totalSum = totalSum + prod.quantity * prod.unitPrice;
        }
        const pageSize = {
            width: 300, // specify width in points (1/72 inch)
            height: auto, // specify height in points (1/72 inch)
        };
        let docDefinition = {
            pageSize: pageSize,
            content: [
                { text: 'Order Note', style: 'header' },
                { text: `Order ID: ${order.orderId}` },
                { text: `Order date: ${order.orderDate}` },
                { text: `Table ID: ${order.tableId}` },
                { text: `Employee name: ${order.employeeName}` },
                { text: `Order status: ${order.status}` },
                { text: `Products:` },
                {
                    ol: order.products.map((prod) => [`Name:${prod.productName}`, `Quantity: ${prod.quantity}`, `Price: ${prod.unitPrice}`]),
                },
                { text: '------------------------------' },
                { text: `Total: ${totalSum.toFixed(2)}$`, style: 'header' },
            ],
            styles: {
                header: { fontSize: 20, bold: true }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    }
}
