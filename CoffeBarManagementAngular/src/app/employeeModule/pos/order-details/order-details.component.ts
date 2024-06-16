import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PosService } from '../pos.service';
import { GetTableOrderDetails } from '../../../shared/models/getTableOrderDetailsDto';
import { EmployeeOrderService } from '../../orders/employee-order.service';
import { AccountService } from '../../../account/account.service';
import { Roles } from '../../../../dependencies/roles';
import { OrderProduct } from '../../../shared/models/orderProduct';
import { environment } from '../../../../environments/environment.development';
import { CartProduct } from '../../../shared/models/cartProduct';
import { SharedService } from '../../../shared/shared.service';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        public posService: PosService,
        private employeeOrdersService: EmployeeOrderService,
        public accountService: AccountService,
        public roles: Roles,
        private router: Router,
        public sharedService: SharedService
    ) {}

    public activeOrder: GetTableOrderDetails[] = [];
    orderDetails: GetTableOrderDetails = {} as GetTableOrderDetails;
    searchInput: string = '';

    ngOnInit(): void {
        this.getOrderDetails();
        
    }

    showSearchResults() {
        const searchValue = parseInt(this.searchInput);
        this.employeeOrdersService.getActiveOrders().subscribe({
            next: (response: any[]) => {
                this.activeOrder = response;
                //console.log(this.activeOrder);
                if (searchValue) {
                    this.activeOrder = this.activeOrder.filter((obj) => {
                        const objValue = obj.orderId;
                        return objValue == searchValue;
                    });
                }

                //console.log(this.activeOrder);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    getOrderDetails() {
        let id: number = 0;
        if (this.route.paramMap) {
            this.route.params.subscribe((params) => {
                id = +params['tableId'];
            });
        }
        this.employeeOrdersService.getActiveOrders().subscribe({
            next: (response: any[]) => {
                this.activeOrder = response;
                if (id > 0) {
                    //console.log(this.activeOrder);
                    this.activeOrder = this.activeOrder.filter((obj) => {
                        const tableId = obj.tableId;
                        return tableId == id;
                    });
                }
                //console.log(this.activeOrder.length);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    changeStatusToDelivered(orderId: number) {
        //console.log(orderId);
        const userId = this.sharedService.getUserId();
        if(userId){
            this.posService.changeStatusToDelivered(orderId,userId).subscribe({
                next: (response) => {
                    //console.log(response);
                },
                error: (e:any) => {
                    console.log(e);
                    this.sharedService.showNotification(false,'Server error',e.error.value.message);
                },
            });
            location.reload();
        }
        
    }

    modifyOrder(orderId: number) {
        localStorage.removeItem(environment.modifyingOrderId);
        localStorage.setItem(environment.modifyingOrderId, JSON.stringify(orderId));
        localStorage.removeItem(environment.modifyCartProducts);
        this.router.navigateByUrl('/employees/pos');
    }

    finishOrder(orderId: number, products: OrderProduct[]) {
        const model: CartProduct[] = [];
        for (let item of products) {
            var itemToAdd: CartProduct = {
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                tva: item.tva,
                total: item.quantity * item.unitPrice,
            };
            model.push(itemToAdd);
        }
        localStorage.removeItem(environment.modifyingOrderId);
        localStorage.setItem(environment.modifyingOrderId, JSON.stringify(orderId));
        localStorage.removeItem(environment.modifyCartProducts);
        localStorage.setItem(environment.modifyCartProducts, JSON.stringify(model));
        this.router.navigateByUrl('/employees/payment');
    }

    deleteProductFromOrder(orderId: number,productId:number){
        this.posService.deleteProductFromOrder(orderId,productId).subscribe({
            next: (response: any) => {
                this.sharedService.showNotificationAndReload(true,'Error appeared',response.value.message, true)
            },
            error : (e: any) => {
                this.sharedService.showNotification(false,'Error appeared',e.error.value.message)
            }
        });
    }
}
