import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
//import { Token, TokenService } from '@core/authentication';
//import { TokenExpiryService } from '@core/authentication/token.expiry.service';
//import { LocalStorageService } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { catchError, mergeMap, of, throwError } from 'rxjs';
import { CommonFunction } from '../utils/common.functions';

export const BASE_URL = new InjectionToken<string>('BASE_URL');

export function hasHttpScheme(url: string) {
  return new RegExp('^http(s)?://', 'i').test(url);
}

export function baseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const baseUrl = inject(BASE_URL, { optional: true });
  //const localStorageService = inject(LocalStorageService);
  const toast = inject(ToastrService);
  //const tokenService = inject(TokenService);
  //const tokenExpService = inject(TokenExpiryService);

  const hasScheme = (url: string) => baseUrl && hasHttpScheme(url);

  const clonedReq = req.clone({
    headers: req.headers
      .set('Accept', 'application/json; charset=utf-8')
      // .set('Cache-Control', 'no-cache')
      // .set('Access-Control-Allow-Origin', 'http://localhost:4200')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('reqId', CommonFunction.getGuid().toString())
      //.set('Authorization', tokenService.getBearerToken()),
  });

  const prependBaseUrl = (url: string) => [baseUrl?.replace(/\/$/g, ''), url.replace(/^\.?\//, '')].filter(val => val).join('/');

  return next(clonedReq).pipe(
    mergeMap((event: HttpEvent<any>) => {
      document.body.style.pointerEvents = 'auto';
      if (event instanceof HttpResponse) {
        if (event.headers.get('token')) {
          const token = {} as any;
          token.access_token = event.headers.get('token') || '';
          token.token_type = 'bearer';
          token.exp = 10;
         // tokenService.set(token);
          if (token) {
           // tokenExpService.startWatching(token.access_token);
          }
        }
        CommonFunction.RemoveFormCRID(CommonFunction.GetLocalVal('setCRformRequestGUID'));
        //const httpResponse = (<IResponse<any>>event.body);
      }
      return of(event);
    }),
    catchError((error: HttpErrorResponse) => {
      if ([200, 400, 403, 500].includes(error.status)) {
        toast.error(error.error.Message);
      }
      CommonFunction.RemoveFormCRID(CommonFunction.GetLocalVal('setCRformRequestGUID'));
      return throwError(error);
    })
  );

  // return hasScheme(req.url) === false
  //   ? next(req.clone({ url: prependBaseUrl(req.url) }))
  //   : next(req);
}
