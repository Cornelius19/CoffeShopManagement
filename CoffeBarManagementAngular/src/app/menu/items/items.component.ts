import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { ActivatedRoute } from '@angular/router';
import { GetProducts } from '../../shared/models/getProducts';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  constructor(private menuService: MenuService,
    private route: ActivatedRoute
  ){}
  
  public items: GetProducts[] = [];
  
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(){
    let id:number = 0;
    if(this.route.paramMap){
      this.route.params.subscribe(params => {
        id = +params['id'];
      })
    }
    if(id != 0){
      this.menuService.getProductsByCategory(id).subscribe({
        next: (response:any) => {
          this.items = response;
        },
        error: error => {
          console.log(error);
        }
      })
    }
    
  }


}
