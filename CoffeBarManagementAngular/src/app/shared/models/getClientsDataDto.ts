export interface GetClientDataDto {
    clientId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    ordersCount: number;
    ordersValue: number;
    lock: boolean;
}
