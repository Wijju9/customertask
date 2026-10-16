import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { isApiRequest, isFailedEnvelope } from './api-utils';

/**
 * Turns the API's own failure format into a normal HTTP error.
 *
 *   success: { Status: true,  Data: ... }
 *   failure: { Status: false, Message: 'Invalid Email or Password.' }
 *
 * A failure that arrives with HTTP 200 would otherwise reach `next:` in the
 * component. After this, every failure goes down the `error:` path, where
 * errorInterceptor shows the message once.
 */
export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req)) return next(req);

  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && isFailedEnvelope(event.body)) {
        const code = Number(event.body.StatusCode);
        throw new HttpErrorResponse({
          error: event.body,
          headers: event.headers,
          status: code >= 400 ? code : 400,
          statusText: 'Bad Request',
          url: event.url ?? req.url,
        });
      }
      return event;
    }),
  );
};
