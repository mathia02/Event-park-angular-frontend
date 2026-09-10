import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  EventService
} from '../../../../core/services/event.service';

import {
  SeatService
} from '../../../../core/services/seat.service';

import {
  Event as EventModel
} from '../../../../core/models/event/event.model';

import {
  Seat
} from '../../../../core/models/seat/seat.model';

@Component({
  selector: 'app-seat-selection',
  standalone: true,

  imports: [
    CommonModule,

  ],

  templateUrl:
    './seat-selection.component.html',

  styleUrl:
    './seat-selection.component.css'
})
export class SeatSelectionComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly eventService =
    inject(EventService);

  private readonly seatService =
    inject(SeatService);

  event =
    signal<EventModel | null>(null);

  seats =
    signal<Seat[]>([]);

  selectedSeatIds =
    signal<number[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  selectedSeats =
    computed(() => {

      const ids =
        this.selectedSeatIds();

      return this.seats()
        .filter(
          seat =>
            ids.includes(seat.id)
        );
    });

  selectedSeatTotal =
    computed(() => {

      const currentEvent =
        this.event();

      if (!currentEvent) {
        return 0;
      }

      return this.selectedSeats()
        .reduce(
          (total, seat) =>
            total +
            (
              seat.priceOverride
              ??
              currentEvent.ticketPrice
            ),
          0
        );
    });

  ngOnInit(): void {

    const eventId =
      Number(
        this.route.snapshot
          .paramMap.get('eventId')
      );

    if (!eventId || eventId <= 0) {

      this.errorMessage.set(
        'Invalid event ID.'
      );

      this.isLoading.set(false);

      return;
    }

    sessionStorage.setItem(
      'reservationEventId',
      eventId.toString()
    );

    this.loadReservationData(
      eventId
    );
  }

  private loadReservationData(
    eventId: number
  ): void {

    this.isLoading.set(true);

    this.eventService
      .getEventById(eventId)
      .subscribe({

        next: (eventResponse) => {

          this.event.set(
            eventResponse
          );

          this.loadSeats(
            eventId
          );
        },

        error: (error) => {

          console.error(
            'Event Load Error:',
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

  private loadSeats(
    eventId: number
  ): void {

    this.seatService
      .getEventSeats(
        eventId,
        true
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Available Seats:',
            response
          );

          this.seats.set(
            response ?? []
          );

          this.restoreSelectedSeats();

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Seat API Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load available seats.'
          );

          this.isLoading.set(false);
        }

      });
  }

  toggleSeat(
    seat: Seat
  ): void {

    const current =
      this.selectedSeatIds();

    if (
      current.includes(
        seat.id
      )
    ) {

      this.selectedSeatIds.set(
        current.filter(
          id => id !== seat.id
        )
      );

      return;
    }

    this.selectedSeatIds.set([
      ...current,
      seat.id
    ]);
  }

  isSelected(
    seatId: number
  ): boolean {

    return this.selectedSeatIds()
      .includes(seatId);
  }

  getSeatPrice(
    seat: Seat
  ): number {

    return seat.priceOverride
      ??
      this.event()?.ticketPrice
      ??
      0;
  }

  continueToParking(): void {

    const currentEvent =
      this.event();

    if (
      !currentEvent ||
      this.selectedSeatIds().length === 0
    ) {

      this.errorMessage.set(
        'Please select at least one seat.'
      );

      return;
    }

    sessionStorage.setItem(
      'reservationSeatIds',
      JSON.stringify(
        this.selectedSeatIds()
      )
    );

    sessionStorage.removeItem(
      'reservationParkingSlotId'
    );

    this.router.navigate([
      '/customer/reservation',
      currentEvent.id,
      'parking'
    ]);
  }

  private restoreSelectedSeats():
    void {

    const saved =
      sessionStorage.getItem(
        'reservationSeatIds'
      );

    if (!saved) {
      return;
    }

    try {

      const ids =
        JSON.parse(saved);

      if (!Array.isArray(ids)) {
        return;
      }

      const availableIds =
        this.seats().map(
          seat => seat.id
        );

      this.selectedSeatIds.set(
        ids.filter(
          (id: number) =>
            availableIds.includes(id)
        )
      );

    } catch {

      sessionStorage.removeItem(
        'reservationSeatIds'
      );
    }
  }
}
