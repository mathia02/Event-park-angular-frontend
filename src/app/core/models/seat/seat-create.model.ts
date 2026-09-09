export interface SeatCreate {
  seatNumber: string;
  rowLabel: string;
  columnNumber: number;
  seatType?: string | null;
  priceOverride?: number | null;
}