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
  ReactiveFormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  EventService,
  EventFilters
} from '../../../../core/services/event.service';

import {
  VenueService
} from '../../../../core/services/venue.service';

import {
  CategoryService
} from '../../../../core/services/category.service';

import {
  Event as EventModel
} from '../../../../core/models/event/event.model';

import {
  Venue
} from '../../../../core/models/venue/venue.model';

import {
  Category
} from '../../../../core/models/category/category.model';

@Component({
  selector: 'app-event-list',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './event-list.component.html',

  styleUrl:
    './event-list.component.css'
})
export class EventListComponent
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly eventService =
    inject(EventService);

  private readonly venueService =
    inject(VenueService);

  private readonly categoryService =
    inject(CategoryService);

  events =
    signal<EventModel[]>([]);

  venues =
    signal<Venue[]>([]);

  categories =
    signal<Category[]>([]);

  isLoading =
    signal(false);

  errorMessage =
    signal('');

  filterForm =
    this.fb.nonNullable.group({

      name: '',

      date: '',

      venueId: '',

      categoryId: ''

    });

  ngOnInit(): void {

    this.loadEvents();

    this.loadVenues();

    this.loadCategories();
  }

  loadEvents(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    const values =
      this.filterForm.getRawValue();

    const filters: EventFilters = {};

    if (values.name.trim()) {

      filters.name =
        values.name.trim();
    }

    if (values.date) {

      filters.date =
        values.date;
    }

    if (values.venueId) {

      filters.venueId =
        Number(values.venueId);
    }

    if (values.categoryId) {

      filters.categoryId =
        Number(values.categoryId);
    }

    this.eventService
      .getEvents(filters)
      .subscribe({

        next: (response) => {

          console.log(
            'Backend Events:',
            response
          );

          this.events.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Events API Error:',
            error
          );

          this.events.set([]);

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load events.'
          );

          this.isLoading.set(false);
        }

      });
  }

  clearFilters(): void {

    this.filterForm.reset({

      name: '',

      date: '',

      venueId: '',

      categoryId: ''

    });

    this.loadEvents();
  }

  private loadVenues(): void {

    this.venueService
      .getVenues()
      .subscribe({

        next: (response) => {

          this.venues.set(
            response ?? []
          );
        },

        error: (error) => {

          console.error(
            'Venues API Error:',
            error
          );

          this.venues.set([]);
        }

      });
  }

  private loadCategories(): void {

    this.categoryService
      .getCategories()
      .subscribe({

        next: (response) => {

          this.categories.set(
            response ?? []
          );
        },

        error: (error) => {

          console.error(
            'Categories API Error:',
            error
          );

          this.categories.set([]);
        }

      });
  }
}
