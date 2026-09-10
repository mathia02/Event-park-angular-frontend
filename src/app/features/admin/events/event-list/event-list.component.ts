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
  RouterLink
} from '@angular/router';

import {
  EventService
} from '../../../../core/services/event.service';

import {
  Event as EventModel
} from '../../../../core/models/event/event.model';

@Component({
  selector: 'app-admin-event-list',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './event-list.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminEventListComponent
  implements OnInit {

  private readonly eventService =
    inject(EventService);

  events =
    signal<EventModel[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  deletingId =
    signal<number | null>(null);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.eventService
      .getEvents()
      .subscribe({

        next: (response) => {

          this.events.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Admin Events Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load events.'
          );

          this.isLoading.set(false);
        }

      });
  }

  deleteEvent(
    event: EventModel
  ): void {

    const confirmed =
      window.confirm(
        `Delete event "${event.name}"?`
      );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(
      event.id
    );

    this.errorMessage.set('');

    this.eventService
      .deleteEvent(event.id)
      .subscribe({

        next: () => {

          this.events.update(
            current =>
              current.filter(
                item =>
                  item.id !== event.id
              )
          );

          this.deletingId.set(null);
        },

        error: (error) => {

          console.error(
            'Delete Event Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to delete event.'
          );

          this.deletingId.set(null);
        }

      });
  }

  toLocalDate(
    value: string
  ): Date {

    const hasTimezone =
      value.endsWith('Z')
      ||
      /[+-]\d{2}:\d{2}$/.test(value);

    return new Date(
      hasTimezone
        ? value
        : `${value}Z`
    );
  }
}
