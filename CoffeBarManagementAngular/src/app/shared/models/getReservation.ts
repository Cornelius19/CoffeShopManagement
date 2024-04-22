export interface GetReservation {
  reservationId: number;
  reservationDate: Date;
  guestNumber: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  reservationStatus: number;
  duration: number;
  tableNumber: number;
}
