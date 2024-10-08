import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    constructor(private http: HttpClient) {}

    getAllCategories() {
        return this.http.get(`${environment.appUrl}/api/category/get-all-categories`);
    }

    getMenuCategories() {
        return this.http.get(`${environment.appUrl}/api/category/get-menu-categories`);
    }

    getProductsByCategory(categoryId: number) {
        return this.http.get(`${environment.appUrl}/api/products/get-menu-products/${categoryId}`);
    }
}
