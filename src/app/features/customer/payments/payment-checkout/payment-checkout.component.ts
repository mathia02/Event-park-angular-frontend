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
  Router,
  RouterLink
} from '@angular/router';

import {
  BookingService
} from '../../../../core/services/booking.service';

import {
  PaymentService
} from '../../../../core/services/payment.service';

import {
  BookingDetails
} from '../../../../core/models/booking/booking-details.model';

import {
  PaymentMethod
} from '../../../../core/models/enums/payment-method.enum';

import {
  BookingStatus
} from '../../../../core/models/enums/booking-status.enum';

@Component({
  selector: 'app-payment-checkout',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './payment-checkout.component.html',

  styleUrl:
    './payment-checkout.component.css'
})
export class PaymentCheckoutComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly bookingService =
    inject(BookingService);

  private readonly paymentService =
    inject(PaymentService);

  readonly PaymentMethod =
    PaymentMethod;

  readonly BookingStatus =
    BookingStatus;

  booking =
    signal<BookingDetails | null>(null);

  selectedMethod =
    signal<PaymentMethod>(
      PaymentMethod.NotSpecified
    );

  isLoading =
    signal(true);

  isPaying =
    signal(false);

  errorMessage =
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
            'Payment Booking:',
            response
          );

          this.booking.set(
            response
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Booking Load Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load booking.'
          );

          this.isLoading.set(false);
        }

      });
  }

  selectMethod(
    method: PaymentMethod
  ): void {

    this.selectedMethod.set(
      method
    );

    this.errorMessage.set('');
  }

  makePayment(): void {

    const currentBooking =
      this.booking();

    if (!currentBooking) {
      return;
    }

    if (
      currentBooking.status !==
      BookingStatus.Pending
    ) {

      this.errorMessage.set(
        'Only pending bookings can be paid.'
      );

      return;
    }

    if (
      this.selectedMethod() ===
      PaymentMethod.NotSpecified
    ) {

      this.errorMessage.set(
        'Please select a payment method.'
      );

      return;
    }

    this.isPaying.set(true);

    this.errorMessage.set('');

    this.paymentService
      .createPayment(
        currentBooking.id,
        {
          paymentMethod:
            this.selectedMethod()
        }
      )
      .subscribe({

        next: (payment) => {

          console.log(
            'Payment Completed:',
            payment
          );

          this.isPaying.set(false);

          this.router.navigate([
            '/customer/payments',
            payment.id,
            'success'
          ]);
        },

        error: (error) => {

          console.error(
            'Payment Error:',
            error
          );

          this.isPaying.set(false);

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to complete payment.'
          );
        }

      });
  }
}
