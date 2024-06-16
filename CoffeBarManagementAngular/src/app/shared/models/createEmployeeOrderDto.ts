import { OrderProductsClient } from "./orderProductsClient";

export interface CreateEmployeeOrder{
    tableId:number,
    products: OrderProductsClient[];
}