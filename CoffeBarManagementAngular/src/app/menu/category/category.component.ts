import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { GetCategories } from '../../shared/models/getCategories';
import { SharedService } from '../../shared/shared.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
    constructor(private menuService: MenuService,
        public sharedService: SharedService
    ) {}

    public categoryList: GetCategories[] = [];

    ngOnInit(): void {
        this.getCategories();
    }

    getCategories() {
        this.menuService.getMenuCategories().subscribe({
            next: (response: any) => {
                this.categoryList = response;
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
