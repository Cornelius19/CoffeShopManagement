import { ProductComponent } from './productComponent';

export interface AddComplexProduct {
    productId:number
    name: string;
    unitPrice: number;
    unitMeasure: string;
    availableForUser: boolean;
    categoryId: number;
    tva: number;
    productComponenetsId: ProductComponent[];
}
