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
  NotificationService
} from '../../../../core/services/notification.service';

import {
  Notification
} from '../../../../core/models/notification/notification.model';

import {
  NotificationType
} from '../../../../core/models/enums/notification-type.enum';

@Component({
  selector: 'app-notification-list',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './notification-list.component.html',

  styleUrl:
    './notification-list.component.css'
})
export class NotificationListComponent
  implements OnInit {

  private readonly notificationService =
    inject(NotificationService);

  notifications =
    signal<Notification[]>([]);

  unreadOnly =
    signal(false);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  markingId =
    signal<number | null>(null);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.notificationService
      .getMyNotifications(
        this.unreadOnly()
      )
      .subscribe({

        next: (response) => {

          console.log(
            'My Notifications:',
            response
          );

          this.notifications.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Notification List Error:',
            error
          );

          this.notifications.set([]);

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load notifications.'
          );

          this.isLoading.set(false);
        }

      });
  }

  showAll(): void {

    if (!this.unreadOnly()) {
      return;
    }

    this.unreadOnly.set(false);

    this.loadNotifications();
  }

  showUnread(): void {

    if (this.unreadOnly()) {
      return;
    }

    this.unreadOnly.set(true);

    this.loadNotifications();
  }

  markAsRead(
    notification: Notification
  ): void {

    if (notification.isRead) {
      return;
    }

    this.markingId.set(
      notification.id
    );

    this.errorMessage.set('');

    this.notificationService
      .markAsRead(
        notification.id
      )
      .subscribe({

        next: (updated) => {

          if (this.unreadOnly()) {

            this.notifications.update(
              current =>
                current.filter(
                  item =>
                    item.id !== updated.id
                )
            );

          } else {

            this.notifications.update(
              current =>
                current.map(
                  item =>
                    item.id === updated.id
                      ? updated
                      : item
                )
            );
          }

          this.markingId.set(null);
        },

        error: (error) => {

          console.error(
            'Mark Notification Read Error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to mark notification as read.'
          );

          this.markingId.set(null);
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

  getTypeClass(
    type: NotificationType
  ): string {

    switch (type) {

      case NotificationType.BookingConfirmed:
        return 'confirmed';

      case NotificationType.BookingCancelled:
        return 'cancelled';

      case NotificationType.PaymentCompleted:
        return 'payment';

      case NotificationType.EventReminder:
        return 'reminder';

      case NotificationType.EventUpdated:
        return 'updated';

      default:
        return '';
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
