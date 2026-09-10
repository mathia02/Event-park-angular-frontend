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
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  VenueService
} from '../../../../core/services/venue.service';

@Component({
  selector: 'app-admin-venue-edit',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './venue-edit.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminVenueEditComponent
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly venueService =
    inject(VenueService);

  venueId =
    signal(0);

  isLoading =
    signal(true);

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

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot
          .paramMap.get('venueId')
      );

    if (!id) {

      this.errorMessage.set(
        'Invalid venue ID.'
      );

      this.isLoading.set(false);

      return;
    }

    this.venueId.set(id);

    this.venueService
      .getVenueById(id)
      .subscribe({

        next: (venue) => {

          this.venueForm.patchValue({

            name:
              venue.name,

            address:
              venue.address,

            capacity:
              venue.capacity

          });

          this.isLoading.set(false);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load venue.'
          );

          this.isLoading.set(false);
        }

      });
  }

  updateVenue(): void {

    if (this.venueForm.invalid) {

      this.venueForm.markAllAsTouched();

      return;
    }

    const value =
      this.venueForm.getRawValue();

    this.isSaving.set(true);

    this.errorMessage.set('');

    this.venueService
      .updateVenue(
        this.venueId(),
        {

          name:
            value.name.trim(),

          address:
            value.address.trim(),

          capacity:
            Number(value.capacity)

        }
      )
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
            'Unable to update venue.'
          );

          this.isSaving.set(false);
        }

      });
  }
}
