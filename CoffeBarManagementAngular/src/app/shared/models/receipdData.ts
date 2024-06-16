import { OrderProduct } from "./orderProduct";

export interface ReceiptData {
    name: string;
    adress: string;
    cif: number;
    city: string;
    createdDate: Date;
    products: OrderProduct[];
}
