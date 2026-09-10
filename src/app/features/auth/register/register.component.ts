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
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password =
    control.get('password')?.value;

  const confirmPassword =
    control.get('confirmPassword')?.value;

  if (
    password &&
    confirmPassword &&
    password !== confirmPassword
  ) {
    return {
      passwordMismatch: true
    };
  }

  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  registerForm = this.fb.nonNullable.group(
    {
      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150)
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],

      password: [
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

  get fullName() {
    return this.registerForm.controls.fullName;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get phone() {
    return this.registerForm.controls.phone;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }

  register(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request =
      this.registerForm.getRawValue();

    this.authService
      .register(request)
      .subscribe({

        next: () => {

          this.isLoading = false;

          this.successMessage =
            'Registration successful. Please verify your email before signing in.';

          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 2000);
        },

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            'Registration failed. Please try again.';
        }

      });
  }
}
