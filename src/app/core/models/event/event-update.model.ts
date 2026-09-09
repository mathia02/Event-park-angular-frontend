export interface EventUpdate {
  name: string;
  description?: string | null;
  venueId: number;
  categoryId: number;
  startDateTime: string;
  endDateTime: string;
  ticketPrice: number;
  parkingFee: number;
  capacity: number;
}