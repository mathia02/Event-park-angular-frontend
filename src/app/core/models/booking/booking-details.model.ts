import { BookingStatus } from '../enums/booking-status.enum';

export interface BookingDetails {
  id: number;
  bookingNumber: string;
  customerId: number;
  customerName: string;
  eventId: number;
  eventName: string;
  status: BookingStatus;
  holdExpiresAt?: string | null;
  createdAt: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  seats: BookingSeatItem[];
  parking?: BookingParking | null;
  totalAmount: number;
}

export interface BookingSeatItem {
  seatId: number;
  seatNumber: string;
  seatType: string;
  priceAtBooking: number;
}

export interface BookingParking {
  parkingSlotId: number;
  slotNumber: string;
  zone: string;
  reservedFee: number;
}