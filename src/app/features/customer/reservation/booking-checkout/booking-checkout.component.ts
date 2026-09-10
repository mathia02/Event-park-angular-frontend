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
  RouterLink
} from '@angular/router';

import {
  forkJoin
} from 'rxjs';

import {
  EventService
} from '../../../../core/services/event.service';

import {
  SeatService
} from '../../../../core/services/seat.service';

import {
  ParkingService
} from '../../../../core/services/parking.service';

import {
  BookingService
} from '../../../../core/services/booking.service';

import {
  Event as EventModel
} from '../../../../core/models/event/event.model';

import {
  Seat
} from '../../../../core/models/seat/seat.model';

import {
  ParkingSlot
} from '../../../../core/models/parking/parking-slot.model';

import {
  BookingDetails
} from '../../../../core/models/booking/booking-details.model';

@Component({
  selector: 'app-booking-checkout',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './booking-checkout.component.html',

  styleUrl:
    './booking-checkout.component.css'
})
export class BookingCheckoutComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly eventService =
    inject(EventService);

  private readonly seatService =
    inject(SeatService);

  private readonly parkingService =
    inject(ParkingService);

  private readonly bookingService =
    inject(BookingService);

  event =
    signal<EventModel | null>(null);

  selectedSeats =
    signal<Seat[]>([]);

  parking =
    signal<ParkingSlot | null>(null);

  createdBooking =
    signal<BookingDetails | null>(null);

  isLoading =
    signal(true);

  isCreating =
    signal(false);

  errorMessage =
    signal('');

  seatTotal =
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

  parkingTotal =
    computed(
      () =>
        this.parking()?.fee
        ?? 0
    );

  grandTotal =
    computed(
      () =>
        this.seatTotal()
        +
        this.parkingTotal()
    );

  ngOnInit(): void {

    const eventId =
      Number(
        this.route.snapshot
          .paramMap.get('eventId')
      );

    const seatIds =
      this.getSeatIds();

    if (
      !eventId ||
      seatIds.length === 0
    ) {

      this.router.navigate([
        '/events'
      ]);

      return;
    }

    this.loadCheckout(
      eventId,
      seatIds
    );
  }

  private loadCheckout(
    eventId: number,
    seatIds: number[]
  ): void {

    this.isLoading.set(true);

    forkJoin({

      event:
        this.eventService
          .getEventById(eventId),

      seats:
        this.seatService
          .getEventSeats(
            eventId,
            false
          )

    }).subscribe({

      next: (response) => {

        this.event.set(
          response.event
        );

        const selected =
          response.seats.filter(
            seat =>
              seatIds.includes(
                seat.id
              )
          );

        this.selectedSeats.set(
          selected
        );

        this.loadParking();

      },

      error: (error) => {

        console.error(
          'Checkout Load Error:',
          error
        );

        this.errorMessage.set(
          error?.error?.message
          ??
          'Unable to load checkout.'
        );

        this.isLoading.set(false);
      }

    });
  }

  private loadParking(): void {

    const parkingId =
      Number(
        sessionStorage.getItem(
          'reservationParkingSlotId'
        )
      );

    if (!parkingId) {

      this.parking.set(null);

      this.isLoading.set(false);

      return;
    }

    this.parkingService
      .getParkingSlotById(
        parkingId
      )
      .subscribe({

        next: (response) => {

          this.parking.set(
            response
          );

          this.isLoading.set(false);
        },

        error: () => {

          this.parking.set(null);

          sessionStorage.removeItem(
            'reservationParkingSlotId'
          );

          this.isLoading.set(false);
        }

      });
  }

  createBooking(): void {

    const currentEvent =
      this.event();

    const seatIds =
      this.getSeatIds();

    if (
      !currentEvent ||
      seatIds.length === 0
    ) {

      this.errorMessage.set(
        'Reservation information is incomplete.'
      );

      return;
    }

    this.isCreating.set(true);

    this.errorMessage.set('');

    const parkingSlotId =
      this.parking()?.id
      ?? null;

    this.bookingService
      .createBooking({

        eventId:
          currentEvent.id,

        seatIds,

        parkingSlotId

      })
      .subscribe({

        next: (response) => {

          console.log(
            'Booking Created:',
            response
          );

          this.createdBooking.set(
            response
          );

          this.isCreating.set(false);

          this.clearReservation();
        },

        error: (error) => {

          console.error(
            'Booking Create Error:',
            error
          );

          this.isCreating.set(false);

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to create booking. Please select available seats again.'
          );
        }

      });
  }

  backToParking(): void {

    const eventId =
      this.event()?.id;

    if (!eventId) {
      return;
    }

    this.router.navigate([
      '/customer/reservation',
      eventId,
      'parking'
    ]);
  }

  private getSeatIds():
    number[] {

    const stored =
      sessionStorage.getItem(
        'reservationSeatIds'
      );

    if (!stored) {
      return [];
    }

    try {

      const ids =
        JSON.parse(stored);

      return Array.isArray(ids)
        ? ids
        : [];

    } catch {

      return [];
    }
  }

  private clearReservation():
    void {

    sessionStorage.removeItem(
      'reservationEventId'
    );

    sessionStorage.removeItem(
      'reservationSeatIds'
    );

    sessionStorage.removeItem(
      'reservationParkingSlotId'
    );
  }
}
