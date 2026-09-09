export interface Event {
  id: number;
  name: string;
  description?: string | null;
  venueId: number;
  venueName: string;
  categoryId: number;
  categoryName: string;
  startDateTime: string;
  endDateTime: string;
  ticketPrice: number;
  parkingFee: number;
  capacity: number;
}