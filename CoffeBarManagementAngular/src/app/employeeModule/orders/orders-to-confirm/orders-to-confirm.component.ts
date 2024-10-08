import { Component, OnInit } from '@angular/core';
import { EmployeeOrderService } from '../employee-order.service';
import { OrderDto } from '../../../shared/models/orderDto';
import { SharedService } from '../../../shared/shared.service';
import { environment } from '../../../../environments/environment.development';
import { ReportPdfServiceService } from '../../../report-pdf-service.service';
import { PosService } from '../../pos/pos.service';
import { AccountModule } from '../../../account/account.module';
import { AccountService } from '../../../account/account.service';
import { Roles } from '../../../../dependencies/roles';

@Component({
    selector: 'app-orders-to-confirm',
    templateUrl: './orders-to-confirm.component.html',
    styleUrl: './orders-to-confirm.component.css',
})
export class OrdersToConfirmComponent implements OnInit {
    constructor(private employeeOrderService: EmployeeOrderService, public sharedService: SharedService,private reportService: ReportPdfServiceService,
        public posService:PosService,public accountService:AccountService, public roles:Roles
    ) {}
    ordersToConfirm: OrderDto[] = [];

    ngOnInit(): void {
        this.getAllOrdersToConfirm();
    }

    getAllOrdersToConfirm() {
        this.employeeOrderService.getAllOrdersToConfirm().subscribe({
            next: (response: any[]) => {
                this.ordersToConfirm = response.map((order) => {
                    return {
                        orderId: order.orderId,
                        orderDate: new Date(order.orderDate),
                        tableId: order.tableId,
                        employeeName: order.EmployeeName,
                        status: order.status,
                        products: order.products,
                    };
                });
                if (this.ordersToConfirm.length > 0) {
                    localStorage.setItem(environment.ordersToConfirmCounter, this.ordersToConfirm.length.toString());
                }

                //console.log(this.ordersToConfirm);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    confirmOrder(orderId: number) {
        if (confirm('Sure about this?')) {
            const userId = this.sharedService.getUserId();
            if (userId) {
                this.employeeOrderService.confirmOrder(userId, orderId).subscribe({
                    next: (response: any) => {
                        this.sharedService.showNotificationAndReload(true, 'Success', response.value.message,true);
                        localStorage.removeItem(environment.ordersToConfirmCounter);
                        this.reportService.generateOrderNotePDF(orderId);
                        //console.log(response);
                    },
                    error: (error:any) => {
                        this.sharedService.showNotification(false, 'Failed', error.error.value.message);
                        //console.log(error);
                    },
                });
            }
        }
    }

    refuseOrder(id: number) {}
}
