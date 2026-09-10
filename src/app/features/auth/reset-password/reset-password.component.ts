import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const newPassword =
    control.get('newPassword')?.value;

  const confirmPassword =
    control.get('confirmPassword')?.value;

  if (
    newPassword &&
    confirmPassword &&
    newPassword !== confirmPassword
  ) {
    return {
      passwordMismatch: true
    };
  }

  return null;
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  token =
    this.route.snapshot.queryParamMap.get('token') ?? '';

  form = this.fb.nonNullable.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]
    },
    {
      validators: passwordMatchValidator
    }
  );

  get newPassword() {
    return this.form.controls.newPassword;
  }

  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  submit(): void {

    if (!this.token) {

      this.errorMessage =
        'Password reset token is missing.';

      return;
    }

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const values =
      this.form.getRawValue();

    this.authService
      .resetPassword({
        token: this.token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      })
      .subscribe({

        next: (response) => {

          this.isLoading = false;

          this.successMessage =
            response.message;

          this.form.reset();
        },

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            'Password reset failed. The link may be invalid or expired.';
        }

      });
  }
}
