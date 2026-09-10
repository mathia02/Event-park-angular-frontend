import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const customerGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token =
    localStorage.getItem('authToken');

  const role =
    localStorage.getItem('authRole');

  if (!token) {
    return router.createUrlTree([
      '/login'
    ]);
  }

  if (role === 'Customer') {
    return true;
  }

  return router.createUrlTree([
    '/'
  ]);
};
