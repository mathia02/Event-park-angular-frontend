import {
  Routes
} from '@angular/router';

import {
  PublicLayoutComponent
} from './layouts/public-layout/public-layout.component';

import {
  CustomerLayoutComponent
} from './layouts/customer-layout/customer-layout.component';

import {
  AdminLayoutComponent
} from './layouts/admin-layout/admin-layout.component';

import {
  customerGuard
} from './core/guards/customer.guard';

import {
  adminGuard
} from './core/guards/admin.guard';

import {
  HomeComponent
} from './features/public/home/home.component';

import {
  EventListComponent
} from './features/public/events/event-list/event-list.component';

import {
  EventDetailsComponent
} from './features/public/events/event-details/event-details.component';

import {
  VenueListComponent
} from './features/public/venues/venue-list/venue-list.component';

import {
  LoginComponent
} from './features/auth/login/login.component';

import {
  RegisterComponent
} from './features/auth/register/register.component';

import {
  VerifyEmailComponent
} from './features/auth/verify-email/verify-email.component';

import {
  ResendVerificationComponent
} from './features/auth/resend-verification/resend-verification.component';

import {
  ForgotPasswordComponent
} from './features/auth/forgot-password/forgot-password.component';

import {
  ResetPasswordComponent
} from './features/auth/reset-password/reset-password.component';

import {
  CustomerDashboardComponent
} from './features/customer/dashboard/customer-dashboard/customer-dashboard.component';

import {
  ProfileViewComponent
} from './features/customer/profile/profile-view/profile-view.component';

import {
  ProfileEditComponent
} from './features/customer/profile/profile-edit/profile-edit.component';

import {
  MyBookingsComponent
} from './features/customer/bookings/my-bookings/my-bookings.component';

import {
  BookingDetailsComponent
} from './features/customer/bookings/booking-details/booking-details.component';

import {
  NotificationListComponent
} from './features/customer/notifications/notification-list/notification-list.component';

import {
  NotificationDetailsComponent
} from './features/customer/notifications/notification-details/notification-details.component';

import {
  SeatSelectionComponent
} from './features/customer/reservation/seat-selection/seat-selection.component';

import {
  ParkingSelectionComponent
} from './features/customer/reservation/parking-selection/parking-selection.component';

import {
  BookingCheckoutComponent
} from './features/customer/reservation/booking-checkout/booking-checkout.component';

import {
  PaymentCheckoutComponent
} from './features/customer/payments/payment-checkout/payment-checkout.component';

import {
  PaymentSuccessComponent
} from './features/customer/payments/payment-success/payment-success.component';

import {
  MyPaymentsComponent
} from './features/customer/payments/my-payments/my-payments.component';

import {
  PaymentDetailsComponent
} from './features/customer/payments/payment-details/payment-details.component';

import {
  AdminDashboardComponent
} from './features/admin/dashboard/admin-dashboard/admin-dashboard.component';

import {
  AdminEventListComponent
} from './features/admin/events/event-list/event-list.component';

import {
  AdminEventCreateComponent
} from './features/admin/events/event-create/event-create.component';

import {
  AdminEventEditComponent
} from './features/admin/events/event-edit/event-edit.component';

import {
  AdminVenueListComponent
} from './features/admin/venues/venue-list/venue-list.component';

import {
  AdminVenueCreateComponent
} from './features/admin/venues/venue-create/venue-create.component';

import {
  AdminVenueEditComponent
} from './features/admin/venues/venue-edit/venue-edit.component';

import {
  AdminCategoryListComponent
} from './features/admin/categories/category-list/category-list.component';

import {
  AdminCategoryCreateComponent
} from './features/admin/categories/category-create/category-create.component';

import {
  AdminCategoryEditComponent
} from './features/admin/categories/category-edit/category-edit.component';

export const routes: Routes = [

  {
    path: '',
    component: PublicLayoutComponent,

    children: [

      {
        path: '',
        component: HomeComponent
      },

      {
        path: 'events',
        component: EventListComponent
      },

      {
        path: 'events/:id',
        component: EventDetailsComponent
      },

      {
        path: 'venues',
        component: VenueListComponent
      }

    ]
  },


  {
    path: 'customer',

    component:
      CustomerLayoutComponent,

    canActivate: [
      customerGuard
    ],

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component:
          CustomerDashboardComponent
      },

      {
        path: 'profile',
        component:
          ProfileViewComponent
      },

      {
        path: 'profile/edit',
        component:
          ProfileEditComponent
      },

      {
        path: 'bookings',
        component:
          MyBookingsComponent
      },

      {
        path: 'bookings/:bookingId',
        component:
          BookingDetailsComponent
      },

      {
        path: 'notifications',
        component:
          NotificationListComponent
      },

      {
        path:
          'notifications/:notificationId',

        component:
          NotificationDetailsComponent
      },

      {
        path:
          'reservation/:eventId/seats',

        component:
          SeatSelectionComponent
      },

      {
        path:
          'reservation/:eventId/parking',

        component:
          ParkingSelectionComponent
      },

      {
        path:
          'reservation/:eventId/checkout',

        component:
          BookingCheckoutComponent
      },

      {
        path:
          'payments/:bookingId/checkout',

        component:
          PaymentCheckoutComponent
      },

      {
        path:
          'payments/:paymentId/success',

        component:
          PaymentSuccessComponent
      },

      {
        path: 'payments',
        component:
          MyPaymentsComponent
      },

      {
        path:
          'payments/:paymentId',

        component:
          PaymentDetailsComponent
      }

    ]
  },


  {
    path: 'admin',

    component:
      AdminLayoutComponent,

    canActivate: [
      adminGuard
    ],

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component:
          AdminDashboardComponent
      },

      {
        path: 'events',
        component:
          AdminEventListComponent
      },

      {
        path: 'events/create',
        component:
          AdminEventCreateComponent
      },

      {
        path: 'events/:eventId/edit',
        component:
          AdminEventEditComponent
      },

      {
        path: 'venues',
        component:
          AdminVenueListComponent
      },

      {
        path: 'venues/create',
        component:
          AdminVenueCreateComponent
      },

      {
        path: 'venues/:venueId/edit',
        component:
          AdminVenueEditComponent
      },

      {
        path: 'categories',
        component:
          AdminCategoryListComponent
      },

      {
        path: 'categories/create',
        component:
          AdminCategoryCreateComponent
      },

      {
        path:
          'categories/:categoryId/edit',

        component:
          AdminCategoryEditComponent
      }

    ]
  },


  {
    path: 'login',
    component:
      LoginComponent
  },

  {
    path: 'register',
    component:
      RegisterComponent
  },

  {
    path: 'verify-email',
    component:
      VerifyEmailComponent
  },

  {
    path: 'resend-verification',
    component:
      ResendVerificationComponent
  },

  {
    path: 'forgot-password',
    component:
      ForgotPasswordComponent
  },

  {
    path: 'reset-password',
    component:
      ResetPasswordComponent
  },

  {
    path: '**',
    redirectTo: ''
  }

];
