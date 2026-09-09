import { SeatStatus } from '../enums/seat-status.enum';

export interface Seat {
  id: number;
  eventId: number;
  seatNumber: string;
  rowLabel: string;
  columnNumber: number;
  seatType?: string | null;
  priceOverride?: number | null;
  status: SeatStatus;
}