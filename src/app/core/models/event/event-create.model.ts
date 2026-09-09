export interface EventCreate {
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