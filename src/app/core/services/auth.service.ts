import { Injectable, computed, inject, signal } from '@angular/core';
import { UserType } from '../models/models';
import { DbService } from './db.service';
import { UserService } from './user.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginModel, UserModel } from '../models/user.model';
import { IResponse } from '../models/response.model';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './storage.service';
import { NotifyService } from './notify.service';
import { SessionService } from './session.service';

const SESSION_KEY = 'filedesk_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = inject(SessionService);
  private readonly userService = inject(UserService);
  private readonly notify = inject(NotifyService);

  /** The logged-in user, or null. */
  readonly currentUser = this.session.user;
  readonly isLoggedIn = this.session.isLoggedIn;
  readonly isAdmin = computed(() => this.session.user()?.UserType === UserType.Admin);


  login(identifier: string, password: string): Observable<IResponse<UserModel>> {
    return this.userService.Login({ Email: identifier.trim(), Password: password }).pipe(
      map((response) => {
        if (!response.Data) throw new Error(response.Message || 'Login failed. Please try again.');
        return response as IResponse<UserModel>;
      }),
      tap((response) => {
        const data = response.Data!;
        this.session.start(data, data.Token ?? null);
        this.notify.success(response.Message || 'Login successful.');
      }),
    );
  }

  logout(): void {
    this.session.clear();
    this.notify.info('You have been logged out.');
  }

}
