import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { BASE_URL, baseUrlInterceptor } from './core/interceptors/base-url-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { tokenInterceptor } from './core/interceptors/token-interceptor';
import { authTokenInterceptor } from './core/interceptors/auth-token-interceptor';
import { apiResponseInterceptor } from './core/interceptors/api-response-interceptor';


// Http interceptor providers in outside-in order
const interceptors = [
  baseUrlInterceptor, // standard headers
  authTokenInterceptor, // Authorization: Bearer <token>
  errorInterceptor, // toast + 401 handling
  apiResponseInterceptor, // { Status: false } -> HTTP error
];

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors(interceptors)),
    // withComponentInputBinding lets route `data` flow straight into component inputs.
    provideRouter(routes, withComponentInputBinding()),
  ],
};
