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
} from '../../../core/services/event.service';

import {
  Event as EventModel
} from '../../../core/models/event/event.model';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './home.component.html',

  styleUrl:
    './home.component.css'
})
export class HomeComponent implements OnInit {

  private readonly eventService =
    inject(EventService);

  upcomingEvents =
    signal<EventModel[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  private loadUpcomingEvents(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.eventService
      .getEvents()
      .subscribe({

        next: (response) => {

          const now =
            new Date().getTime();

          const events =
            (response ?? [])
              .filter(event =>
                new Date(
                  event.startDateTime
                ).getTime() >= now
              )
              .sort(
                (a, b) =>
                  new Date(
                    a.startDateTime
                  ).getTime()
                  -
                  new Date(
                    b.startDateTime
                  ).getTime()
              )
              .slice(0, 6);

          this.upcomingEvents.set(
            events
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Home Events API Error:',
            error
          );

          this.upcomingEvents.set([]);

          this.errorMessage.set(
            'Unable to load upcoming events.'
          );

          this.isLoading.set(false);
        }

      });
  }
}
