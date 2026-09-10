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
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  EventService
} from '../../../../core/services/event.service';

import {
  Event as EventModel
} from '../../../../core/models/event/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './event-details.component.html',

  styleUrl:
    './event-details.component.css'
})
export class EventDetailsComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly eventService =
    inject(EventService);

  event =
    signal<EventModel | null>(null);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  isCustomer =
    localStorage.getItem('authRole')
    === 'Customer';

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot
          .paramMap.get('id')
      );

    if (!id || id <= 0) {

      this.errorMessage.set(
        'Invalid event ID.'
      );

      this.isLoading.set(false);

      return;
    }

    this.loadEvent(id);
  }

  private loadEvent(
    id: number
  ): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.eventService
      .getEventById(id)
      .subscribe({

        next: (response) => {

          console.log(
            'Selected Event:',
            response
          );

          this.event.set(response);

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Event Details API Error:',
            error
          );

          this.event.set(null);

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load event details.'
          );

          this.isLoading.set(false);
        }

      });
  }
}
