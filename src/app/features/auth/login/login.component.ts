import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request =
      this.loginForm.getRawValue();

    this.authService
      .login(request)
      .subscribe({

        next: (response) => {

          localStorage.setItem(
            'authToken',
            response.token
          );

          localStorage.setItem(
            'authRole',
            response.role
          );

          localStorage.setItem(
            'customerId',
            response.customerId.toString()
          );

          localStorage.setItem(
            'fullName',
            response.fullName
          );

          localStorage.setItem(
            'email',
            response.email
          );

          localStorage.setItem(
            'emailVerified',
            response.emailVerified.toString()
          );

          localStorage.setItem(
            'tokenExpiresAt',
            response.expiresAt
          );

          this.isLoading = false;

          if (
            response.role === 'Administrator'
          ) {

            this.router.navigate([
              '/admin/dashboard'
            ]);

            return;
          }

          this.router.navigate([
            '/customer/dashboard'
          ]);
        },

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            'Login failed. Please check your email and password.';
        }

      });
  }
}
