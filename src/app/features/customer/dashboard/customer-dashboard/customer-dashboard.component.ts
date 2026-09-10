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
  DashboardService
} from '../../../../core/services/dashboard.service';

import {
  CustomerDashboard
} from '../../../../core/models/dashboard/customer-dashboard.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './customer-dashboard.component.html',

  styleUrl:
    './customer-dashboard.component.css'
})
export class CustomerDashboardComponent
  implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  private readonly router =
    inject(Router);

  dashboard =
    signal<CustomerDashboard | null>(null);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  customerName =
    signal(
      localStorage.getItem('fullName')
      ?? 'Customer'
    );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.dashboardService
      .getCustomerDashboard()
      .subscribe({

        next: (response) => {

          console.log(
            'Customer Dashboard:',
            response
          );

          this.dashboard.set(response);

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Customer Dashboard API Error:',
            error
          );

          this.isLoading.set(false);

          if (
            error?.status === 401 ||
            error?.status === 403
          ) {

            this.clearAuth();

            this.router.navigate([
              '/login'
            ]);

            return;
          }

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load dashboard.'
          );
        }

      });
  }

  logout(): void {

    this.clearAuth();

    this.router.navigate([
      '/login'
    ]);
  }

  private clearAuth(): void {

    localStorage.removeItem(
      'authToken'
    );

    localStorage.removeItem(
      'authRole'
    );

    localStorage.removeItem(
      'customerId'
    );

    localStorage.removeItem(
      'fullName'
    );

    localStorage.removeItem(
      'email'
    );

    localStorage.removeItem(
      'emailVerified'
    );

    localStorage.removeItem(
      'tokenExpiresAt'
    );
  }
}
