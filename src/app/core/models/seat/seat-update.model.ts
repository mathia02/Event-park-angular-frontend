export interface SeatUpdate {
  seatNumber: string;
  rowLabel: string;
  columnNumber: number;
  seatType?: string | null;
  priceOverride?: number | null;
}