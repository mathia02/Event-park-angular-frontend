import {
  Component,
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
  VenueService
} from '../../../../core/services/venue.service';

@Component({
  selector: 'app-admin-venue-create',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './venue-create.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminVenueCreateComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly router =
    inject(Router);

  private readonly venueService =
    inject(VenueService);

  isSaving =
    signal(false);

  errorMessage =
    signal('');

  venueForm =
    this.fb.nonNullable.group({

      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      address: [
        '',
        [
          Validators.required,
          Validators.maxLength(300)
        ]
      ],

      capacity: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]

    });

  createVenue(): void {

    this.errorMessage.set('');

    if (this.venueForm.invalid) {

      this.venueForm.markAllAsTouched();

      return;
    }

    this.isSaving.set(true);

    const value =
      this.venueForm.getRawValue();

    this.venueService
      .createVenue({

        name:
          value.name.trim(),

        address:
          value.address.trim(),

        capacity:
          Number(value.capacity)

      })
      .subscribe({

        next: () => {

          this.isSaving.set(false);

          this.router.navigate([
            '/admin/venues'
          ]);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to create venue.'
          );

          this.isSaving.set(false);
        }

      });
  }
}
