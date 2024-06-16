import { Component, OnInit } from '@angular/core';
import { ReportPdfServiceService } from '../../report-pdf-service.service';
import { MenuService } from '../../menu/menu.service';
import { GetCategories } from '../../shared/models/getCategories';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  
  constructor(public reportService: ReportPdfServiceService, private menuService: MenuService){}
  
  allCategories: GetCategories[] = [];
  categoryId:number = 0;
  
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    this.menuService.getAllCategories().subscribe({
      next:(response:any) => {
        this.allCategories = response;
      }
    });
  }

  generateStockProductsReport(){
    this.reportService.generateStockProductsReport(this.categoryId);
  }

}
