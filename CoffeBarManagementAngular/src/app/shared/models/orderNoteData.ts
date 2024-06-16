import { NoteProducts } from "./noteProducts";

export interface OrderNoteData {
    organizationName: string;
    orderDate: Date;
    tableId: number;
    products:NoteProducts [];
    employeeName: string;
    orderId: number;
    orderStatus: string;
    total: number;
}
