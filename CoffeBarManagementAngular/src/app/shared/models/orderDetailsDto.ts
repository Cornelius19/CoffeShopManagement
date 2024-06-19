import { OrderProduct } from "./orderProduct";

export interface OrderDetailsDto {
    orderId: number;
    orderDate: Date;
    orderStatus: string;
    clientName: string;
    takenBy: string;
    delieveredBy: string;
    tableId: number;
    orderValue: number;
    products: OrderProduct[];
}
