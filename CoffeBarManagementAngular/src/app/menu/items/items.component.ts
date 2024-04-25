import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { ActivatedRoute } from '@angular/router';
import { GetProducts } from '../../shared/models/getProducts';
import { OrdersService } from '../../orders/orders.service';
import { CartProduct } from '../../shared/models/cartProduct';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private sharedService: SharedService,
  ) {}

  public items: GetProducts[] = [];

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    let id: number = 0;
    if (this.route.paramMap) {
      this.route.params.subscribe((params) => {
        id = +params['id'];
      });
    }
    if (id != 0) {
      this.menuService.getProductsByCategory(id).subscribe({
        next: (response: any) => {
          this.items = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  addToCart(itemProductId: number) {
    const existingProduct = this.ordersService.cartList.find(
      (p) => p.productId === itemProductId,
    );
    if (existingProduct) {
      existingProduct.quantity++;
      existingProduct.total =
        existingProduct.quantity * existingProduct.unitPrice;
      this.sharedService.showNotification(
        true,
        'Quantity modified',
        `Now quntity is set to ${existingProduct.quantity}!`,
      );
    } else {
      const item = this.items.find((i) => i.productId == itemProductId);
      if (item) {
        const addItemToCart: CartProduct = {
          productId: itemProductId,
          productName: item.productName,
          unitPrice: item.productPrice,
          quantity: 1,
          total: item.productPrice,
        };
        this.ordersService.cartList.push(addItemToCart);
        this.sharedService.showNotification(
          true,
          'Success',
          `Item was added to the cart!`,
        );
      } else {
        this.sharedService.showNotification(
          false,
          'Error',
          'You are trying somehow a produs that does not exist!',
        );
        return;
      }
      console.log(this.ordersService.cartList);
      this.ordersService.updateCartCounter();
    }
  }
}
