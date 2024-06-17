export interface GetEmployeeDataDto {
    employeeId: number;
    firstName: string;
    lastName: string;
    email: string;
    salary: number;
    employeeRole: string;
    totalCreatedOrders: number;
    totalDelieveredOrders: number;
    lock:boolean;
}
