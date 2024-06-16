import { Component, OnInit } from '@angular/core';
import { faTrashCan, faEdit } from '@fortawesome/free-regular-svg-icons';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MenuService } from '../../../menu/menu.service';
import { GetCategories } from '../../../shared/models/getCategories';
import { AdminService } from '../../admin-service.service';
import { BalanceCategories } from '../../../shared/models/balanceCategories';

@Component({
  selector: 'app-balancing-categories',
  templateUrl: './balancing-categories.component.html',
  styleUrl: './balancing-categories.component.css'
})
export class BalancingCategoriesComponent implements OnInit {
  constructor(private menuService: MenuService, private adminService: AdminService) {}

  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  productCategories: BalanceCategories[] = [];
  faTrashCan = faTrashCan;
  faEdit = faEdit;

  ngOnInit(): void {
      this.getCategories();
      this.dtOptions = {
          pagingType: 'full_numbers',
      };
  }

  getCategories() {
      this.adminService.getBalanceCategories().subscribe({
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

  addNewBalanceCategory() {
      this.adminService.showAddBalanceCategory();
  }

  modifyCategory(categoryId: number, name: string) {
    this.adminService.showModifyBalanceCategory(categoryId,name);
  }

  deleteCategory() {}
}
