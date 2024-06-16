import { EmployeesOrdersDay } from "./EmployeesOrdersDay";
import { ProductSelledPerDay } from "./ProductsSelledPerDay";

export interface PosClosedReport {
    name: string;
    createdAt: Date;
    forDay: Date;
    finishedOrdersCounter: number;
    canceledOrdersCounter: number;
    totalOrdersValue: number;
    employeesOrders: EmployeesOrdersDay[];
    products: ProductSelledPerDay[];
}