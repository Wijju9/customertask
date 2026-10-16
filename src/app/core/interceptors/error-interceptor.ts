import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';
import { NotifyService } from '../../shared/notify.service';
import { SKIP_ERROR_TOAST, getErrorMessage, isApiRequest, isPublicEndpoint } from './api-utils';

/**
 * The single place API errors are shown to the user.
 *
 * - 401 on a normal call: the session is over. Clear it and go to the login page.
 * - Anything else: show the API's `Message` in a toast.
 *
 * The error is always re-thrown, so a component can still stop its spinner
 * in `error:`. It should not show a second toast.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req)) return next(req);

  const session = inject(SessionService);
  const router = inject(Router);
  const notify = inject(NotifyService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicEndpoint(req)) {
        // Several calls can fail together; only the first one ends the session.
        if (session.isLoggedIn()) {
          session.clear();
          notify.warning('Your session has expired. Please log in again.');
          router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
        }
      } else if (!req.context.get(SKIP_ERROR_TOAST)) {
        notify.error(getErrorMessage(error));
      }
      return throwError(() => error);
    }),
  );
};
