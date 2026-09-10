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
  selector: 'app-payment-details',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './payment-details.component.html',

  styleUrl:
    './payment-details.component.css'
})
export class PaymentDetailsComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly paymentService =
    inject(PaymentService);

  readonly PaymentStatus =
    PaymentStatus;

  payment =
    signal<Payment | null>(null);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  ngOnInit(): void {

    const paymentId =
      Number(
        this.route.snapshot
          .paramMap.get('paymentId')
      );

    if (!paymentId) {

      this.errorMessage.set(
        'Invalid payment ID.'
      );

      this.isLoading.set(false);

      return;
    }

    this.paymentService
      .getPaymentById(paymentId)
      .subscribe({

        next: (response) => {

          this.payment.set(response);

          this.isLoading.set(false);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load payment details.'
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
