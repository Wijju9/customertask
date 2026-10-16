import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { SessionService, isTokenExpired } from '../services/session.service';
import { apiResponseInterceptor } from './api-response-interceptor';
import { authTokenInterceptor } from './auth-token-interceptor';
import { errorInterceptor } from './error-interceptor';

const API = environment.apiBaseUrl;

describe('auth + http interceptors', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let session: SessionService;
  let toastr: { success: any; error: any; warning: any; info: any };

  beforeEach(() => {
    localStorage.clear();
    toastr = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authTokenInterceptor, errorInterceptor, apiResponseInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: toastr },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionService);
  });

  const user = { id: 5, name: 'A', email: 'a@x.com', mobileNo: '', userType: 2 as const, isAdmin: false };

  it('adds the bearer token to API requests once logged in', () => {
    session.start(user, 'tok123');
    http.get(`${API}Task/List`).subscribe();
    const req = backend.expectOne(`${API}Task/List`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok123');
    req.flush({ Status: true, Data: [] });
  });

  it('sends no Authorization header before login or to other sites', () => {
    http.get(`${API}Task/List`).subscribe();
    expect(backend.expectOne(`${API}Task/List`).request.headers.has('Authorization')).toBe(false);

    session.start(user, 'tok123');
    http.get('https://example.com/data').subscribe();
    expect(backend.expectOne('https://example.com/data').request.headers.has('Authorization')).toBe(false);
  });

  it('turns { Status: false } with HTTP 200 into one error toast', () => {
    let failed = false;
    http.post(`${API}User/Login`, {}).subscribe({ error: () => (failed = true) });
    backend.expectOne(`${API}User/Login`).flush({ Status: false, Message: 'Invalid Email or Password.' });
    expect(failed).toBe(true);
    expect(toastr.error).toHaveBeenCalledTimes(1);
    expect(toastr.error).toHaveBeenCalledWith('Invalid Email or Password.', undefined);
  });

  it('shows the Message of a 400 error body once', () => {
    http.get(`${API}Task/List`).subscribe({ error: () => {} });
    backend.expectOne(`${API}Task/List`).flush({ Status: false, Message: 'Bad data' }, { status: 400, statusText: 'Bad Request' });
    expect(toastr.error).toHaveBeenCalledTimes(1);
    expect(toastr.error).toHaveBeenCalledWith('Bad data', undefined);
  });

  it('ends the session and goes to login on a 401', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    session.start(user, 'tok123');
    http.get(`${API}Task/List`).subscribe({ error: () => {} });
    http.get(`${API}Task/Other`).subscribe({ error: () => {} });
    backend.expectOne(`${API}Task/List`).flush({}, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(`${API}Task/Other`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(session.isLoggedIn()).toBe(false);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(toastr.warning).toHaveBeenCalledTimes(1);
  });

  it('shows the login message for a 401 from the login call instead of "session expired"', () => {
    http.post(`${API}User/Login`, {}).subscribe({ error: () => {} });
    backend.expectOne(`${API}User/Login`).flush({ Status: false, Message: 'Invalid Email or Password.' }, { status: 401, statusText: 'Unauthorized' });
    expect(toastr.warning).not.toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Invalid Email or Password.', undefined);
  });

  it('starts a session from { Status: true, Data } and keeps it after a reload', () => {
    const auth = TestBed.inject(AuthService);
    auth.login(' admin@company.com ', 'pw').subscribe();
    const req = backend.expectOne(`${API}User/Login`);
    expect(req.request.body).toEqual({ Email: 'admin@company.com', Password: 'pw' });
    req.flush({ Status: true, Message: 'Welcome', Data: { Id: 1, Email: 'admin@company.com', IsAdmin: true, UserType: 1, Token: 'jwt-token' } });

    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.isAdmin()).toBe(true);
    expect(session.token()).toBe('jwt-token');
    expect(toastr.success).toHaveBeenCalledWith('Welcome', undefined);

    // A new SessionService (page reload) reads the saved session.
    expect(JSON.parse(localStorage.getItem('filedesk_auth')!).token).toBe('jwt-token');

    auth.logout();
    expect(auth.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('filedesk_auth')).toBeNull();
  });

  it('treats an expired JWT as logged out', () => {
    const jwt = (exp: number) => `h.${btoa(JSON.stringify({ exp }))}.s`;
    expect(isTokenExpired(jwt(1))).toBe(true);
    expect(isTokenExpired(jwt(Math.floor(Date.now() / 1000) + 3600))).toBe(false);
    expect(isTokenExpired('not-a-jwt')).toBe(false);

    session.start(user, jwt(1));
    expect(session.validate()).toBe(false);
    expect(session.isLoggedIn()).toBe(false);
  });
});
