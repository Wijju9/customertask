import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { catchError, mergeMap, of, throwError } from 'rxjs';
import { CommonFunction } from '../utils/common.functions';

export const BASE_URL = new InjectionToken<string>('BASE_URL');

export function hasHttpScheme(url: string) {
  return new RegExp('^http(s)?://', 'i').test(url);
}

/**
 * Adds the standard request headers and does the per-request cleanup.
 * Errors are not shown here: errorInterceptor does that, once.
 */
export function baseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const clonedReq = req.clone({
    headers: req.headers
      .set('Accept', 'application/json; charset=utf-8')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('reqId', CommonFunction.getGuid().toString()),
  });

  return next(clonedReq).pipe(
    mergeMap((event: HttpEvent<any>) => {
      document.body.style.pointerEvents = 'auto';
      if (event instanceof HttpResponse) {
        CommonFunction.RemoveFormCRID(CommonFunction.GetLocalVal('setCRformRequestGUID'));
      }
      return of(event);
    }),
    catchError((error: HttpErrorResponse) => {
      CommonFunction.RemoveFormCRID(CommonFunction.GetLocalVal('setCRformRequestGUID'));
      return throwError(() => error);
    }),
  );
}
