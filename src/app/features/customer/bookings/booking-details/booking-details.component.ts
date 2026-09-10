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
  ActivatedRoute,
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
  selector: 'app-booking-details',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './booking-details.component.html',

  styleUrl:
    './booking-details.component.css'
})
export class BookingDetailsComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly bookingService =
    inject(BookingService);

  readonly BookingStatus =
    BookingStatus;

  booking =
    signal<BookingDetails | null>(null);

  isLoading =
    signal(true);

  isCancelling =
    signal(false);

  errorMessage =
    signal('');

  successMessage =
    signal('');

  ngOnInit(): void {

    const bookingId =
      Number(
        this.route.snapshot
          .paramMap.get('bookingId')
      );

    if (
      !bookingId ||
      bookingId <= 0
    ) {

      this.errorMessage.set(
        'Invalid booking ID.'
      );

      this.isLoading.set(false);

      return;
    }

    this.loadBooking(
      bookingId
    );
  }

  private loadBooking(
    bookingId: number
  ): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.bookingService
      .getBookingById(
        bookingId
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Booking Details:',
            response
          );

          this.booking.set(
            response
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Booking Details Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load booking details.'
          );

          this.isLoading.set(false);
        }

      });
  }

  cancelBooking(): void {

    const currentBooking =
      this.booking();

    if (!currentBooking) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to cancel ${currentBooking.bookingNumber}?`
      );

    if (!confirmed) {
      return;
    }

    this.isCancelling.set(true);

    this.errorMessage.set('');

    this.successMessage.set('');

    this.bookingService
      .cancelBooking(
        currentBooking.id
      )
      .subscribe({

        next: (response) => {

          this.booking.set(
            response
          );

          this.isCancelling.set(
            false
          );

          this.successMessage.set(
            'Booking cancelled successfully.'
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

          this.isCancelling.set(
            false
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

  const expiryTime =
    this.parseUtcDate(
      booking.holdExpiresAt
    );

  return (
    expiryTime.getTime()
    <=
    Date.now()
  );
}

toLocalDate(
  value: string | null | undefined
): Date | null {

  if (!value) {
    return null;
  }

  return this.parseUtcDate(value);
}

private parseUtcDate(
  value: string
): Date {

  const hasTimezone =
    value.endsWith('Z')
    ||
    /[+-]\d{2}:\d{2}$/.test(value);

  return new Date(
    hasTimezone
      ? value
      : `${value}Z`
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
