import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { GetCategories } from '../../../shared/models/getCategories';
import { MenuService } from '../../../menu/menu.service';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { faTrashCan, faEdit } from '@fortawesome/free-regular-svg-icons';
import { AdminService } from '../../admin-service.service';

@Component({
    selector: 'app-product-categories',
    templateUrl: './product-categories.component.html',
    styleUrl: './product-categories.component.css',
})
export class ProductCategoriesComponent implements OnInit {
    constructor(private menuService: MenuService, private adminService: AdminService) {}

    dtOptions: Config = {};
    dtTrigger: Subject<any> = new Subject<any>();
    productCategories: GetCategories[] = [];
    faTrashCan = faTrashCan;
    faEdit = faEdit;

    ngOnInit(): void {
        this.getCategories();
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
    }

    getCategories() {
        this.menuService.getAllCategories().subscribe({
            next: (response: any) => {
                this.productCategories = response;
                this.dtTrigger.next(null);
                //console.log(this.productCategories);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    addNewCategory() {
        this.adminService.showAddNewProductCategory();
    }

    modifyCategory(categoryId: number, name: string, availableMenu: boolean) {
        this.adminService.showModifyProductCategory(categoryId,name,availableMenu);
    }

    deleteCategory() {}
}
