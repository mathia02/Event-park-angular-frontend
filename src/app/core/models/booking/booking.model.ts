import { BookingStatus } from '../enums/booking-status.enum';

export interface Booking {
  id: number;
  bookingNumber: string;
  customerId: number;
  eventId: number;
  eventName: string;
  status: BookingStatus;
  holdExpiresAt?: string | null;
  createdAt: string;
}