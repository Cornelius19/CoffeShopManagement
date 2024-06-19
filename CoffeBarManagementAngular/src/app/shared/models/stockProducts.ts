import { GetComponentProducts } from './getComponentProducts';
import { ProductComponent } from './productComponent';

export interface StockProducts {
    productId: number;
    name: string;
    unitPrice: number;
    unitMeasure: string;
    availableForUser: boolean;
    complexProduct: boolean;
    categoryId: number;
    quantity: number;
    supplyCheck: number;
    tva: number;
    componentProducts: GetComponentProducts[];
}
