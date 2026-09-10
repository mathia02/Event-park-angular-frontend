import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]

  });

  get email() {
    return this.form.controls.email;
  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .forgotPassword(
        this.form.getRawValue()
      )
      .subscribe({

        next: (response) => {

          this.isLoading = false;

          this.successMessage =
            response.message;
        },

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to process password reset request.';
        }

      });
  }
}
