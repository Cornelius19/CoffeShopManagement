import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { ActivatedRoute } from '@angular/router';
import { GetProducts } from '../../shared/models/getProducts';
import { OrdersService } from '../../orders/orders.service';
import { CartProduct } from '../../shared/models/cartProduct';
import { SharedService } from '../../shared/shared.service';
import { AccountService } from '../../account/account.service';
import { environment } from '../../../environments/environment.development';

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
        public accountService: AccountService,
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
                    console.log(this.items);
                    
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }
    }

    addToCart(itemProductId: number) {
        //add products for a new order
        let productListFromStorage: CartProduct[] = [];
        productListFromStorage = this.ordersService.getCartItemsToList();
        const existingProduct = productListFromStorage.find((p) => p.productId === itemProductId);
        if (existingProduct) {
            existingProduct.quantity++;
            existingProduct.total = existingProduct.quantity * existingProduct.unitPrice;
            this.ordersService.addCartItemsToLocalStorage(productListFromStorage);
            this.ordersService.updateCartCounter(productListFromStorage);
            this.ordersService.getCounter();
            this.sharedService.showNotification(
                true,
                'Quantity modified',
                `Now quantity for ${existingProduct.productName} is set to ${existingProduct.quantity}!`,
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
                productListFromStorage.push(addItemToCart);
                this.ordersService.addCartItemsToLocalStorage(productListFromStorage);
                this.ordersService.updateCartCounter(productListFromStorage);
                this.ordersService.getCounter();
                this.sharedService.showNotification(true, 'Congrats!', `${addItemToCart.productName} was added to the cart!`);
            } else {
                this.sharedService.showNotification(false, 'Error', 'You are trying to add to the cart somehow a product that does not exist!');
                return;
            }
        }
    }
}
