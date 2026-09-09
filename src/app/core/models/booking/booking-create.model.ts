export interface BookingCreate {
  eventId: number;
  seatIds: number[];
  parkingSlotId?: number | null;
}