import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { GetCategorys } from '../../shared/models/getCategory';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  constructor(private menuService: MenuService) {}

  public categoryList : GetCategorys[] = [];

  ngOnInit(): void {
    this.getCategorys();
  }

  getCategorys() {
    this.menuService.getAllCategorys().subscribe({
      next: (response:any) => {
        this.categoryList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
