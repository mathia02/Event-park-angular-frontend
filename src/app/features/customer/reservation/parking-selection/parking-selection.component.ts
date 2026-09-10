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
  Router
} from '@angular/router';

import {
  EventService
} from '../../../../core/services/event.service';

import {
  ParkingService
} from '../../../../core/services/parking.service';

import {
  Event as EventModel
} from '../../../../core/models/event/event.model';

import {
  ParkingSlot
} from '../../../../core/models/parking/parking-slot.model';

@Component({
  selector: 'app-parking-selection',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './parking-selection.component.html',

  styleUrl:
    './parking-selection.component.css'
})
export class ParkingSelectionComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly eventService =
    inject(EventService);

  private readonly parkingService =
    inject(ParkingService);

  event =
    signal<EventModel | null>(null);

  parkingSlots =
    signal<ParkingSlot[]>([]);

  selectedParkingSlotId =
    signal<number | null>(null);

  seatIds =
    signal<number[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  ngOnInit(): void {

    const eventId =
      Number(
        this.route.snapshot
          .paramMap.get('eventId')
      );

    this.restoreSeats();

    if (
      !eventId ||
      this.seatIds().length === 0
    ) {

      this.router.navigate([
        '/events'
      ]);

      return;
    }

    this.loadData(
      eventId
    );
  }

  private restoreSeats(): void {

    const stored =
      sessionStorage.getItem(
        'reservationSeatIds'
      );

    if (!stored) {
      return;
    }

    try {

      const ids =
        JSON.parse(stored);

      if (Array.isArray(ids)) {

        this.seatIds.set(
          ids
        );
      }

    } catch {

      this.seatIds.set([]);
    }
  }

  private loadData(
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

          this.loadParking(
            eventId
          );
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load event.'
          );

          this.isLoading.set(false);
        }

      });
  }

  private loadParking(
    eventId: number
  ): void {

    this.parkingService
      .getEventParkingSlots(
        eventId,
        true
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Available Parking:',
            response
          );

          this.parkingSlots.set(
            response ?? []
          );

          this.restoreParking();

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Parking API Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load parking.'
          );

          this.isLoading.set(false);
        }

      });
  }

  selectParking(
    slot: ParkingSlot
  ): void {

    if (
      this.selectedParkingSlotId()
      === slot.id
    ) {

      this.selectedParkingSlotId
        .set(null);

      return;
    }

    this.selectedParkingSlotId
      .set(slot.id);
  }

  isSelected(
    slotId: number
  ): boolean {

    return (
      this.selectedParkingSlotId()
      === slotId
    );
  }

  selectedParking():
    ParkingSlot | undefined {

    return this.parkingSlots()
      .find(
        slot =>
          slot.id ===
          this.selectedParkingSlotId()
      );
  }

  continueToCheckout(): void {

    const eventId =
      this.event()?.id;

    if (!eventId) {
      return;
    }

    const parkingId =
      this.selectedParkingSlotId();

    if (parkingId) {

      sessionStorage.setItem(
        'reservationParkingSlotId',
        parkingId.toString()
      );

    } else {

      sessionStorage.removeItem(
        'reservationParkingSlotId'
      );
    }

    this.router.navigate([
      '/customer/reservation',
      eventId,
      'checkout'
    ]);
  }

  backToSeats(): void {

    const eventId =
      this.event()?.id;

    if (!eventId) {
      return;
    }

    this.router.navigate([
      '/customer/reservation',
      eventId,
      'seats'
    ]);
  }

  private restoreParking(): void {

    const value =
      Number(
        sessionStorage.getItem(
          'reservationParkingSlotId'
        )
      );

    if (
      value > 0 &&
      this.parkingSlots()
        .some(
          slot =>
            slot.id === value
        )
    ) {

      this.selectedParkingSlotId
        .set(value);
    }
  }
}
