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
  NotificationService
} from '../../../../core/services/notification.service';

import {
  Notification
} from '../../../../core/models/notification/notification.model';

import {
  NotificationType
} from '../../../../core/models/enums/notification-type.enum';

@Component({
  selector: 'app-notification-details',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './notification-details.component.html',

  styleUrl:
    './notification-details.component.css'
})
export class NotificationDetailsComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly notificationService =
    inject(NotificationService);

  notification =
    signal<Notification | null>(null);

  isLoading =
    signal(true);

  isMarking =
    signal(false);

  errorMessage =
    signal('');

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot
          .paramMap.get('notificationId')
      );

    if (!id || id <= 0) {

      this.errorMessage.set(
        'Invalid notification ID.'
      );

      this.isLoading.set(false);

      return;
    }

    this.loadNotification(id);
  }

  private loadNotification(
    id: number
  ): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.notificationService
      .getNotificationById(id)
      .subscribe({

        next: (response) => {

          this.notification.set(
            response
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Notification Details Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load notification.'
          );

          this.isLoading.set(false);
        }

      });
  }

  markAsRead(): void {

    const current =
      this.notification();

    if (
      !current ||
      current.isRead
    ) {
      return;
    }

    this.isMarking.set(true);

    this.errorMessage.set('');

    this.notificationService
      .markAsRead(
        current.id
      )
      .subscribe({

        next: (response) => {

          this.notification.set(
            response
          );

          this.isMarking.set(false);
        },

        error: (error) => {

          console.error(
            'Mark Read Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to mark notification as read.'
          );

          this.isMarking.set(false);
        }

      });
  }

  getTypeName(
    type: NotificationType
  ): string {

    switch (type) {

      case NotificationType.BookingConfirmed:
        return 'Booking Confirmed';

      case NotificationType.BookingCancelled:
        return 'Booking Cancelled';

      case NotificationType.PaymentCompleted:
        return 'Payment Completed';

      case NotificationType.EventReminder:
        return 'Event Reminder';

      case NotificationType.EventUpdated:
        return 'Event Updated';

      default:
        return 'Notification';
    }
  }

  toLocalDate(
    value: string | null | undefined
  ): Date | null {

    if (!value) {
      return null;
    }

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
