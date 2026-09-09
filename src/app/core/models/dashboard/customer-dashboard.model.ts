export interface CustomerDashboard {
  generatedAtUtc: string;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  expiredBookings: number;
  upcomingConfirmedBookings: number;
  totalPaid: number;
  unreadNotifications: number;
}