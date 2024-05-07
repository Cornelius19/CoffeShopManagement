export interface GetReservation {
  reservationId: number;
  reservationDate: Date;
  guestNumber: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  reservationStatus: boolean;
  duration: number;
  tableNumber: number;
}
