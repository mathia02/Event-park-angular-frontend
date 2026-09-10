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
  selector: 'app-admin-event-edit',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './event-edit.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminEventEditComponent
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly eventService =
    inject(EventService);

  private readonly venueService =
    inject(VenueService);

  private readonly categoryService =
    inject(CategoryService);

  eventId =
    signal(0);

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

    const id =
      Number(
        this.route.snapshot
          .paramMap.get('eventId')
      );

    if (!id || id <= 0) {

      this.errorMessage.set(
        'Invalid event ID.'
      );

      this.isLoading.set(false);

      return;
    }

    this.eventId.set(id);

    forkJoin({

      event:
        this.eventService
          .getEventById(id),

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

        this.eventForm.patchValue({

          name:
            response.event.name,

          description:
            response.event.description
            ?? '',

          venueId:
            response.event.venueId,

          categoryId:
            response.event.categoryId,

          startDateTime:
            this.toLocalInput(
              response.event.startDateTime
            ),

          endDateTime:
            this.toLocalInput(
              response.event.endDateTime
            ),

          ticketPrice:
            response.event.ticketPrice,

          parkingFee:
            response.event.parkingFee,

          capacity:
            response.event.capacity

        });

        this.isLoading.set(false);
      },

      error: (error) => {

        console.error(
          'Load Event Edit Error:',
          error
        );

        this.errorMessage.set(
          error?.error?.message
          ??
          'Unable to load event.'
        );

        this.isLoading.set(false);
      }

    });
  }

  updateEvent(): void {

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
      .updateEvent(
        this.eventId(),
        {

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

        }
      )
      .subscribe({

        next: () => {

          this.isSaving.set(false);

          this.router.navigate([
            '/admin/events'
          ]);
        },

        error: (error) => {

          console.error(
            'Update Event Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to update event.'
          );

          this.isSaving.set(false);
        }

      });
  }

  private toLocalInput(
    value: string
  ): string {

    const hasTimezone =
      value.endsWith('Z')
      ||
      /[+-]\d{2}:\d{2}$/.test(value);

    const date =
      new Date(
        hasTimezone
          ? value
          : `${value}Z`
      );

    const pad =
      (number: number) =>
        number
          .toString()
          .padStart(2, '0');

    return (
      `${date.getFullYear()}-` +
      `${pad(date.getMonth() + 1)}-` +
      `${pad(date.getDate())}T` +
      `${pad(date.getHours())}:` +
      `${pad(date.getMinutes())}`
    );
  }
}
