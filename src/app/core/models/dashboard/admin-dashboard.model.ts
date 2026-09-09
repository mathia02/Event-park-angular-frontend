export interface AdminDashboard {
  generatedAtUtc: string;
  totalCustomers: number;
  totalVenues: number;
  totalCategories: number;
  totalEvents: number;
  upcomingEvents: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  expiredBookings: number;
  totalRevenue: number;
  availableSeats: number;
  heldSeats: number;
  bookedSeats: number;
  availableParkingSlots: number;
  heldParkingSlots: number;
  bookedParkingSlots: number;
  unavailableParkingSlots: number;
}