import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly authService =
    inject(AuthService);

  isLoading = true;

  isSuccess = false;

  message = '';

  ngOnInit(): void {

    const token =
      this.route.snapshot.queryParamMap.get(
        'token'
      );

    if (!token) {

      this.isLoading = false;
      this.isSuccess = false;

      this.message =
        'Verification token is missing.';

      return;
    }

    this.verifyEmail(token);
  }

  private verifyEmail(
    token: string
  ): void {

    this.authService
      .verifyEmail(token)
      .subscribe({

        next: (response) => {

          this.isLoading = false;
          this.isSuccess = true;

          this.message =
            response.message;
        },

        error: (error) => {

          this.isLoading = false;
          this.isSuccess = false;

          this.message =
            error?.error?.message ??
            'Email verification failed. The link may be invalid or expired.';
        }

      });
  }
}
