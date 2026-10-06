import { Injectable, computed, inject, signal } from '@angular/core';
import { UserType } from '../models/models';
import { DbService } from './db.service';

const SESSION_KEY = 'filedesk_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(DbService);

  private readonly sessionUserId = signal<number | null>(this.readSession());

  /** The logged-in user, or null. Inactive users are treated as logged out. */
  readonly currentUser = computed(() => {
    const id = this.sessionUserId();
    return this.store.db().users.find((user) => user.id === id && user.isActive) ?? null;
  });

  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.userType === UserType.Admin);

  /** Returns an error message, or null when the login worked. */
  login(identifier: string, password: string): string | null {
    const wanted = identifier.trim().toLowerCase();
    const user = this.store
      .db()
      .users.find((u) => (u.mobileNo === wanted || u.email.toLowerCase() === wanted) && u.password === password);

    if (!user) return 'Mobile/email or password is incorrect.';
    if (!user.isActive) return 'This account is inactive. Contact your admin.';

    this.sessionUserId.set(user.id);
    this.writeSession(user.id);
    return null;
  }

  logout(): void {
    this.sessionUserId.set(null);
    this.writeSession(null);
  }

  private readSession(): number | null {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  }

  private writeSession(userId: number | null): void {
    try {
      if (userId === null) localStorage.removeItem(SESSION_KEY);
      else localStorage.setItem(SESSION_KEY, String(userId));
    } catch {
      // Ignore: the session just will not survive a page refresh.
    }
  }
}
