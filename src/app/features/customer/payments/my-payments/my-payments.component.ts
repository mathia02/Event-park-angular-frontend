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
  PaymentService
} from '../../../../core/services/payment.service';

import {
  Payment
} from '../../../../core/models/payment/payment.model';

import {
  PaymentMethod
} from '../../../../core/models/enums/payment-method.enum';

import {
  PaymentStatus
} from '../../../../core/models/enums/payment-status.enum';

@Component({
  selector: 'app-my-payments',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './my-payments.component.html',

  styleUrl:
    './my-payments.component.css'
})
export class MyPaymentsComponent
  implements OnInit {

  private readonly paymentService =
    inject(PaymentService);

  readonly PaymentStatus =
    PaymentStatus;

  payments =
    signal<Payment[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.paymentService
      .getMyPayments()
      .subscribe({

        next: (response) => {

          console.log(
            'My Payments:',
            response
          );

          this.payments.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'My Payments Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load payments.'
          );

          this.isLoading.set(false);
        }

      });
  }

  getMethodName(
    method: PaymentMethod
  ): string {

    switch (method) {

      case PaymentMethod.Card:
        return 'Card';

      case PaymentMethod.BankTransfer:
        return 'Bank Transfer';

      case PaymentMethod.MobileWallet:
        return 'Mobile Wallet';

      default:
        return 'Not Specified';
    }
  }
}
