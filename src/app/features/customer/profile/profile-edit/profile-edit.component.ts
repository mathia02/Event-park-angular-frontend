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
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  CustomerService
} from '../../../../core/services/customer.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './profile-edit.component.html',

  styleUrl:
    './profile-edit.component.css'
})
export class ProfileEditComponent
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly customerService =
    inject(CustomerService);

  private readonly router =
    inject(Router);

  isLoading =
    signal(true);

  isSaving =
    signal(false);

  errorMessage =
    signal('');

  successMessage =
    signal('');

  private customerId:
    number | null = null;

  profileForm =
    this.fb.nonNullable.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(
            /^[0-9+\-\s()]{7,20}$/
          )
        ]
      ]

    });

  ngOnInit(): void {

    this.customerId =
      this.getCustomerId();

    if (!this.customerId) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    this.loadProfile(
      this.customerId
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

        next: (customer) => {

          this.profileForm.patchValue({

            fullName:
              customer.fullName,

            phone:
              customer.phone

          });

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Profile Load Error:',
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

  saveProfile(): void {

    this.successMessage.set('');

    this.errorMessage.set('');

    if (
      this.profileForm.invalid
    ) {

      this.profileForm
        .markAllAsTouched();

      return;
    }

    if (!this.customerId) {
      return;
    }

    this.isSaving.set(true);

    const formValue =
      this.profileForm.getRawValue();

    this.customerService
      .updateCustomer(
        this.customerId,
        {
          fullName:
            formValue.fullName.trim(),

          phone:
            formValue.phone.trim()
        }
      )
      .subscribe({

        next: (customer) => {

          console.log(
            'Updated Customer:',
            customer
          );

          localStorage.setItem(
            'fullName',
            customer.fullName
          );

          this.isSaving.set(false);

          this.successMessage.set(
            'Profile updated successfully.'
          );
        },

        error: (error) => {

          console.error(
            'Profile Update Error:',
            error
          );

          this.isSaving.set(false);

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to update profile.'
          );
        }

      });
  }

  get fullName() {
    return this.profileForm
      .controls.fullName;
  }

  get phone() {
    return this.profileForm
      .controls.phone;
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
