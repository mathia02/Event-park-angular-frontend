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
  customerGuard
} from './core/guards/customer.guard';

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
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },

  {
    path: 'resend-verification',
    component: ResendVerificationComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

  {
    path: '**',
    redirectTo: ''
  }

];
