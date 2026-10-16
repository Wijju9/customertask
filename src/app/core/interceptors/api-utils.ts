import { HttpContextToken, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Set this on a request when the caller shows its own error message:
 *   this.http.get(url, { context: new HttpContext().set(SKIP_ERROR_TOAST, true) })
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

/** Endpoints that work without a login. A 401 from these is a normal failure, not an expired session. */
const PUBLIC_ENDPOINTS = ['User/Login', 'User/Insert'];

/** True for calls to our own API. Other URLs never get the token or the error handling. */
export function isApiRequest(req: HttpRequest<unknown>): boolean {
  return req.url.startsWith(environment.apiBaseUrl);
}

export function isPublicEndpoint(req: HttpRequest<unknown>): boolean {
  return PUBLIC_ENDPOINTS.some((path) => req.url.startsWith(environment.apiBaseUrl + path));
}

/** The API reports failure as `{ Status: false, Message: '...' }`, sometimes with HTTP 200. */
export function isFailedEnvelope(body: unknown): body is { Status: false; Message?: string; StatusCode?: number } {
  return typeof body === 'object' && body !== null && (body as { Status?: unknown }).Status === false;
}

/** Picks the best message to show the user for a failed call. */
export function getErrorMessage(error: HttpErrorResponse): string {
  const body = error.error;
  const fromBody = typeof body === 'string' ? body : (body?.Message ?? body?.message ?? body?.msg);
  if (typeof fromBody === 'string' && fromBody.trim()) return fromBody;

  if (error.status === 0) return 'Cannot reach the server. Please check your connection.';
  if (error.status === 401) return 'You are not authorised. Please log in again.';
  if (error.status === 403) return 'You do not have permission to do this.';
  if (error.status === 404) return 'The requested item was not found.';
  if (error.status >= 500) return 'Something went wrong on the server. Please try again.';
  return error.statusText || 'Something went wrong. Please try again.';
}
