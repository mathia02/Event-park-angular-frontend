import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  BookingService
} from '../../../../core/services/booking.service';

import {
  BookingDetails
} from '../../../../core/models/booking/booking-details.model';

import {
  BookingStatus
} from '../../../../core/models/enums/booking-status.enum';

@Component({
  selector: 'app-my-bookings',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './my-bookings.component.html',

  styleUrl:
    './my-bookings.component.css'
})
export class MyBookingsComponent
  implements OnInit {

  private readonly bookingService =
    inject(BookingService);

  readonly BookingStatus =
    BookingStatus;

  bookings =
    signal<BookingDetails[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  cancellingBookingId =
    signal<number | null>(null);

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.bookingService
      .getMyBookings()
      .subscribe({

        next: (response) => {

          console.log(
            'My Bookings:',
            response
          );

          this.bookings.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'My Bookings Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load bookings.'
          );

          this.isLoading.set(false);
        }

      });
  }

  cancelBooking(
    booking: BookingDetails
  ): void {

    const confirmed =
      window.confirm(
        `Cancel booking ${booking.bookingNumber}?`
      );

    if (!confirmed) {
      return;
    }

    this.cancellingBookingId.set(
      booking.id
    );

    this.errorMessage.set('');

    this.bookingService
      .cancelBooking(
        booking.id
      )
      .subscribe({

        next: (updatedBooking) => {

          this.bookings.update(
            current =>
              current.map(
                item =>
                  item.id ===
                  updatedBooking.id
                    ? updatedBooking
                    : item
              )
          );

          this.cancellingBookingId.set(
            null
          );
        },

        error: (error) => {

          console.error(
            'Cancel Booking Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to cancel booking.'
          );

          this.cancellingBookingId.set(
            null
          );
        }

      });
  }

  canCancel(
    booking: BookingDetails
  ): boolean {

    return (
      booking.status ===
        BookingStatus.Pending
      ||
      booking.status ===
        BookingStatus.Confirmed
    );
  }

  canPay(
    booking: BookingDetails
  ): boolean {

    return (
      booking.status ===
        BookingStatus.Pending
      &&
      booking.totalAmount > 0
      &&
      !this.isHoldExpired(
        booking
      )
    );
  }

  isHoldExpired(
    booking: BookingDetails
  ): boolean {

    if (!booking.holdExpiresAt) {
      return false;
    }

    return (
      new Date(
        booking.holdExpiresAt
      ).getTime()
      <=
      Date.now()
    );
  }

  getStatusName(
    status: BookingStatus
  ): string {

    switch (status) {

      case BookingStatus.Pending:
        return 'Pending';

      case BookingStatus.Confirmed:
        return 'Confirmed';

      case BookingStatus.Cancelled:
        return 'Cancelled';

      case BookingStatus.Expired:
        return 'Expired';

      default:
        return 'Unknown';
    }
  }

  getStatusClass(
    status: BookingStatus
  ): string {

    switch (status) {

      case BookingStatus.Pending:
        return 'pending';

      case BookingStatus.Confirmed:
        return 'confirmed';

      case BookingStatus.Cancelled:
        return 'cancelled';

      case BookingStatus.Expired:
        return 'expired';

      default:
        return '';
    }
  }
}
