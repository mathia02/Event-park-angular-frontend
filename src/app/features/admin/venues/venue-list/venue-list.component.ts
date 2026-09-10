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
  VenueService
} from '../../../../core/services/venue.service';

import {
  Venue
} from '../../../../core/models/venue/venue.model';

@Component({
  selector: 'app-admin-venue-list',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './venue-list.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminVenueListComponent
  implements OnInit {

  private readonly venueService =
    inject(VenueService);

  venues =
    signal<Venue[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  deletingId =
    signal<number | null>(null);

  ngOnInit(): void {
    this.loadVenues();
  }

  loadVenues(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.venueService
      .getVenues()
      .subscribe({

        next: (response) => {

          this.venues.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load venues.'
          );

          this.isLoading.set(false);
        }

      });
  }

  deleteVenue(
    venue: Venue
  ): void {

    const confirmed =
      window.confirm(
        `Delete venue "${venue.name}"?`
      );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(
      venue.id
    );

    this.errorMessage.set('');

    this.venueService
      .deleteVenue(venue.id)
      .subscribe({

        next: () => {

          this.venues.update(
            current =>
              current.filter(
                item =>
                  item.id !== venue.id
              )
          );

          this.deletingId.set(null);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to delete venue.'
          );

          this.deletingId.set(null);
        }

      });
  }
}
