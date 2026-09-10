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
  Router,
  RouterLink
} from '@angular/router';

import {
  CustomerService
} from '../../../../core/services/customer.service';

import {
  Customer
} from '../../../../core/models/customer/customer.model';

import {
  CustomerStatus
} from '../../../../core/models/enums/customer-status.enum';

@Component({
  selector: 'app-profile-view',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './profile-view.component.html',

  styleUrl:
    './profile-view.component.css'
})
export class ProfileViewComponent
  implements OnInit {

  private readonly customerService =
    inject(CustomerService);

  private readonly router =
    inject(Router);

  readonly CustomerStatus =
    CustomerStatus;

  profile =
    signal<Customer | null>(null);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  ngOnInit(): void {

    const customerId =
      this.getCustomerId();

    if (!customerId) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    this.loadProfile(
      customerId
    );
  }

  private loadProfile(
    customerId: number
  ): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.customerService
      .getCustomerById(customerId)
      .subscribe({

        next: (response) => {

          console.log(
            'Customer Profile:',
            response
          );

          this.profile.set(response);

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Profile API Error:',
            error
          );

          this.isLoading.set(false);

          if (
            error?.status === 401 ||
            error?.status === 403
          ) {

            this.router.navigate([
              '/login'
            ]);

            return;
          }

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load profile.'
          );
        }

      });
  }

  private getCustomerId():
    number | null {

    const value =
      Number(
        localStorage.getItem(
          'customerId'
        )
      );

    return value > 0
      ? value
      : null;
  }
}
