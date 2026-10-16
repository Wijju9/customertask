import { Injectable, computed, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { UserType } from '../models/models';
import { IResponse } from '../models/response.model';
import { UserModel } from '../models/user.model';
import { NotifyService } from '../../shared/notify.service';
import { SessionService, SessionUser } from './session.service';
import { UserService } from './user.service';

/**
 * Login and logout.
 *
 * Failures (wrong password, server down, ...) are shown as a toast by
 * errorInterceptor and arrive here as an HTTP error, so this service only
 * handles the success path.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = inject(SessionService);
  private readonly userService = inject(UserService);
  private readonly notify = inject(NotifyService);

  /** The logged-in user, or null. */
  readonly currentUser = this.session.user;
  readonly isLoggedIn = this.session.isLoggedIn;
  readonly isAdmin = computed(() => this.session.user()?.isAdmin === true);

  /**
   * Calls the login API. On `{ Status: true, Data: user }` it starts the
   * session (user + token) and shows a success toast.
   */
  login(identifier: string, password: string): Observable<IResponse<UserModel>> {
    return this.userService.Login({ Email: identifier.trim(), Password: password }).pipe(
      map((response) => {
        if (!response.Data) throw new Error(response.Message || 'Login failed. Please try again.');
        return response as IResponse<UserModel>;
      }),
      tap((response) => {
        const data = response.Data!;
        this.session.start(toSessionUser(data), data.Token ?? null);
        this.notify.success(response.Message || 'Login successful.');
      }),
    );
  }

  logout(): void {
    this.session.clear();
    this.notify.info('You have been logged out.');
  }
}

function toSessionUser(data: UserModel): SessionUser {
  const userType = data.UserType === UserType.Admin || data.IsAdmin ? UserType.Admin : UserType.Employee;
  return {
    id: data.Id ?? 0,
    name: data.Name ?? '',
    email: data.Email ?? '',
    mobileNo: data.MobileNo ?? '',
    userType,
    isAdmin: userType === UserType.Admin,
  };
}
