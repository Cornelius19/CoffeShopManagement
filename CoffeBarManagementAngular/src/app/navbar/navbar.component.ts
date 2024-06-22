import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
import { Roles } from '../../dependencies/roles';
import { OrdersService } from '../orders/orders.service';
import { environment } from '../../environments/environment.development';
import { EmployeeOrderService } from '../employeeModule/orders/employee-order.service';
import { IntervalFuntionsService } from '../interval-funtions.service';
import { faMaximize, faMinimize } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
    constructor(
        public accountService: AccountService,
        public roles: Roles,
        public ordersService: OrdersService,
        public intervalService: IntervalFuntionsService,
    ) {}
    ngOnInit(): void {
        this.ordersService.getCounter();
    }
    faMinimize = faMinimize;
    faMaximize = faMaximize;
    isFullScreen: boolean = false;

    logout() {
        this.accountService.logout();
        this.ordersService.clearCart();
        this.ordersService.getCounter();
        localStorage.removeItem(environment.orderID);
    }

    enterFullscreen() {
        const elem = document.documentElement as HTMLElement & {
            mozRequestFullScreen?: () => Promise<void>;
            webkitRequestFullscreen?: () => Promise<void>;
            msRequestFullscreen?: () => Promise<void>;
        };

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            this.isFullScreen = true;
        } else if (elem.mozRequestFullScreen) {
            // Firefox
            elem.mozRequestFullScreen();
            this.isFullScreen = true;
        } else if (elem.webkitRequestFullscreen) {
            // Chrome, Safari, and Opera
            elem.webkitRequestFullscreen();
            this.isFullScreen = true;
        } else if (elem.msRequestFullscreen) {
            // IE/Edge
            elem.msRequestFullscreen();
            this.isFullScreen = true;
        }
    }

    // Method to exit fullscreen
    exitFullscreen() {
        const doc = document as Document & {
            mozCancelFullScreen?: () => Promise<void>;
            webkitExitFullscreen?: () => Promise<void>;
            msExitFullscreen?: () => Promise<void>;
        };

        if (doc.exitFullscreen) {
            doc.exitFullscreen();
            this.isFullScreen = false;
        } else if (doc.mozCancelFullScreen) {
            // Firefox
            doc.mozCancelFullScreen();
            this.isFullScreen = false;
        } else if (doc.webkitExitFullscreen) {
            // Chrome, Safari, and Opera
            doc.webkitExitFullscreen();
            this.isFullScreen = false;
        } else if (doc.msExitFullscreen) {
            // IE/Edge
            doc.msExitFullscreen();
            this.isFullScreen = false;
        }
    }
}
