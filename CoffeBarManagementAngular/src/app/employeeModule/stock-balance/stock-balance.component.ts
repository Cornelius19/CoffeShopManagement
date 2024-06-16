import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { PosService } from '../pos/pos.service';
import { GetComponentProducts } from '../../shared/models/getComponentProducts';
import { AdminService } from '../../admin/admin-service.service';
import { BalanceCategories } from '../../shared/models/balanceCategories';

@Component({
    selector: 'app-stock-balance',
    templateUrl: './stock-balance.component.html',
    styleUrl: './stock-balance.component.css',
})
export class StockBalanceComponent implements OnInit {
    constructor(public sharedService: SharedService, private formBuilder: FormBuilder, private posService: PosService,
      private adminService: AdminService
    ) {}

    isSubmitted: boolean = false;
    stockBalanceForm: FormGroup = new FormGroup({});
    allProducts: GetComponentProducts[] = [];
    categories : BalanceCategories[] = [];


    ngOnInit(): void {
        this.initializeForm();
        this.getAllProduct();
        this.getCategories();
    }

    initializeForm() {
        this.stockBalanceForm = this.formBuilder.group({
            productId: ['', [Validators.required]],
            remove_quantity: ['', [Validators.required]],
            remove_categoryId: ['', [Validators.required]],
        });
    }

    createBalanceStock() {
      this.isSubmitted = true;
      if(this.stockBalanceForm.valid){
        const productID = this.stockBalanceForm.get('productId')?.value;
        const categoryId = this.stockBalanceForm.get('remove_categoryId')?.value;
        const quantity = this.stockBalanceForm.get('remove_quantity')?.value;
        if(productID != null && categoryId != null && quantity!= null){
          this.posService.addNewBalanceRecord(productID,categoryId,quantity).subscribe({
            next:(response:any) => {
              this.sharedService.showNotification(true,'Success',response.value.message);
              this.isSubmitted = false;
              this.stockBalanceForm.reset();
            },
            error: (e:any) => {
              this.sharedService.showNotification(false,'Error appeared', e.error.value.message);
            }
          });

        }
      }
      
    }

    getAllProduct() {
        this.posService.getAllProductStockBalance().subscribe({
            next: (response: any) => {
                this.allProducts = response;
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getCategories(){
      this.adminService.getBalanceCategories().subscribe({
        next: (response:any) => {
          this.categories = response;
          //console.log(this.categories);
        },
        error: e=> {
          console.log(e);
          
        }
      });
    }
}
