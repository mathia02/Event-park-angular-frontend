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
  forkJoin
} from 'rxjs';

import {
  EventService
} from '../../../../core/services/event.service';

import {
  VenueService
} from '../../../../core/services/venue.service';

import {
  CategoryService
} from '../../../../core/services/category.service';

import {
  Venue
} from '../../../../core/models/venue/venue.model';

import {
  Category
} from '../../../../core/models/category/category.model';

@Component({
  selector: 'app-admin-event-create',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './event-create.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminEventCreateComponent
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly router =
    inject(Router);

  private readonly eventService =
    inject(EventService);

  private readonly venueService =
    inject(VenueService);

  private readonly categoryService =
    inject(CategoryService);

  venues =
    signal<Venue[]>([]);

  categories =
    signal<Category[]>([]);

  isLoading =
    signal(true);

  isSaving =
    signal(false);

  errorMessage =
    signal('');

  eventForm =
    this.fb.nonNullable.group({

      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(1000)
        ]
      ],

      venueId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      categoryId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      startDateTime: [
        '',
        [
          Validators.required
        ]
      ],

      endDateTime: [
        '',
        [
          Validators.required
        ]
      ],

      ticketPrice: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      parkingFee: [
        0,
        [
          Validators.required,
          Validators.min(0)
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

    forkJoin({

      venues:
        this.venueService
          .getVenues(),

      categories:
        this.categoryService
          .getCategories()

    }).subscribe({

      next: (response) => {

        this.venues.set(
          response.venues ?? []
        );

        this.categories.set(
          response.categories ?? []
        );

        this.isLoading.set(false);
      },

      error: (error) => {

        console.error(
          'Event Form Options Error:',
          error
        );

        this.errorMessage.set(
          'Unable to load venues or categories.'
        );

        this.isLoading.set(false);
      }

    });
  }

  createEvent(): void {

    this.errorMessage.set('');

    if (this.eventForm.invalid) {

      this.eventForm.markAllAsTouched();

      return;
    }

    const value =
      this.eventForm.getRawValue();

    const start =
      new Date(
        value.startDateTime
      );

    const end =
      new Date(
        value.endDateTime
      );

    if (
      end.getTime()
      <=
      start.getTime()
    ) {

      this.errorMessage.set(
        'End date/time must be after start date/time.'
      );

      return;
    }

    this.isSaving.set(true);

    this.eventService
      .createEvent({

        name:
          value.name.trim(),

        description:
          value.description.trim()
          || null,

        venueId:
          Number(value.venueId),

        categoryId:
          Number(value.categoryId),

        startDateTime:
          start.toISOString(),

        endDateTime:
          end.toISOString(),

        ticketPrice:
          Number(value.ticketPrice),

        parkingFee:
          Number(value.parkingFee),

        capacity:
          Number(value.capacity)

      })
      .subscribe({

        next: () => {

          this.isSaving.set(false);

          this.router.navigate([
            '/admin/events'
          ]);
        },

        error: (error) => {

          console.error(
            'Create Event Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to create event.'
          );

          this.isSaving.set(false);
        }

      });
  }
}
