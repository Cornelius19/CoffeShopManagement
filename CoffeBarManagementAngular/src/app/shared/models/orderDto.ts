import { OrderProduct } from "./orderProduct";
export interface OrderDto{
    orderId: number;
    orderDate: Date;
    tableId: number;
    employeeName: string;
    status: string;
    products: OrderProduct[];
}