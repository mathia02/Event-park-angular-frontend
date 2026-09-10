import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const adminGuard: CanActivateFn = () => {

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

  if (role === 'Administrator') {
    return true;
  }

  return router.createUrlTree([
    '/'
  ]);
};
