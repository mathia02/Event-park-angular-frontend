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
  Router
} from '@angular/router';

import {
  DashboardService
} from '../../../../core/services/dashboard.service';

import {
  AdminDashboard
} from '../../../../core/models/dashboard/admin-dashboard.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './admin-dashboard.component.html',

  styleUrl:
    './admin-dashboard.component.css'
})
export class AdminDashboardComponent
  implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  private readonly router =
    inject(Router);

  dashboard =
    signal<AdminDashboard | null>(null);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  adminName =
    signal(
      localStorage.getItem('fullName')
      ?? 'Administrator'
    );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.dashboardService
      .getAdminDashboard()
      .subscribe({

        next: (response) => {

          console.log(
            'Admin Dashboard:',
            response
          );

          this.dashboard.set(
            response
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Admin Dashboard Error:',
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
            error?.error?.message
            ??
            'Unable to load admin dashboard.'
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

  toLocalDate(
    value: string | null | undefined
  ): Date | null {

    if (!value) {
      return null;
    }

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
