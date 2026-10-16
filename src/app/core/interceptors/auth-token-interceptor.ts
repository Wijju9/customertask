import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { SessionService } from '../services/session.service';
import { isApiRequest } from './api-utils';

/**
 * Adds `Authorization: Bearer <token>` to every API request once the user is logged in.
 * If the API sends a fresh token in a `token` response header, it replaces the stored one.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req)) return next(req);

  const session = inject(SessionService);
  const token = session.token();
  const authReq =
    token && !req.headers.has('Authorization')
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const refreshed = event.headers.get('token');
        if (refreshed && session.isLoggedIn()) session.updateToken(refreshed);
      }
    }),
  );
};
