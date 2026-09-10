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
  VenueService
} from '../../../../core/services/venue.service';

import {
  Venue
} from '../../../../core/models/venue/venue.model';

@Component({
  selector: 'app-venue-list',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './venue-list.component.html',

  styleUrl:
    './venue-list.component.css'
})
export class VenueListComponent
  implements OnInit {

  private readonly venueService =
    inject(VenueService);

  venues =
    signal<Venue[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  ngOnInit(): void {
    this.loadVenues();
  }

  private loadVenues(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.venueService
      .getVenues()
      .subscribe({

        next: (response) => {

          console.log(
            'Backend Venues:',
            response
          );

          this.venues.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Venue API Error:',
            error
          );

          this.venues.set([]);

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load venues.'
          );

          this.isLoading.set(false);
        }

      });
  }
}
