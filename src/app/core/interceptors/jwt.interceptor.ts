import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('authToken');

  const isBackendRequest =
    req.url.startsWith(environment.apiUrl);

  if (token && isBackendRequest) {

    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authRequest);
  }

  return next(req);
};