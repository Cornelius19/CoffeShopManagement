import { OrderProduct } from './orderProduct';

export interface GetTableOrderDetails {
    orderId: number;
    orderDate: Date;
    tableId: number;
    takeEmployeeName: string;
    finishEmployeeName: string;
    clientName:string;
    status: string;
    products: OrderProduct[];
}
