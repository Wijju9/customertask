import { Injectable, computed, signal } from '@angular/core';
import { UserType } from '../models/models';

const STORAGE_KEY = 'filedesk_auth';

/** The logged-in user, as the rest of the app sees them. */
export interface SessionUser {
  id: number;
  name: string;
  email: string;
  mobileNo: string;
  userType: UserType;
  isAdmin: boolean;
}

interface StoredSession {
  token: string | null;
  user: SessionUser;
}

/**
 * Holds the login session: who is logged in and their API token.
 *
 * The session is saved in localStorage so it survives a page refresh, and
 * it is cleared on logout, on a 401 response, or when the token has expired.
 * This service has no dependencies on purpose, so HTTP interceptors can use
 * it without creating a circular injection.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly state = signal<StoredSession | null>(this.read());

  readonly user = computed(() => this.state()?.user ?? null);
  readonly token = computed(() => this.state()?.token ?? null);
  readonly isLoggedIn = computed(() => this.state() !== null);

  /** Start a session after a successful login. */
  start(user: SessionUser, token: string | null): void {
    const session: StoredSession = { token, user };
    this.state.set(session);
    this.write(session);
  }

  /** Swap in a refreshed token (e.g. the API sends a new one in a response header). */
  updateToken(token: string): void {
    const current = this.state();
    if (!current || current.token === token) return;
    const session = { ...current, token };
    this.state.set(session);
    this.write(session);
  }

  /** End the session on this device. */
  clear(): void {
    this.state.set(null);
    this.write(null);
  }

  /**
   * True when there is a session whose token has not expired.
   * An expired session is cleared as a side effect. Guards call this on every navigation.
   */
  validate(): boolean {
    const session = this.state();
    if (!session) return false;
    if (isTokenExpired(session.token)) {
      this.clear();
      return false;
    }
    return true;
  }

  private read(): StoredSession | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved) as StoredSession;
      return parsed?.user?.id != null ? parsed : null;
    } catch {
      return null;
    }
  }

  private write(session: StoredSession | null): void {
    try {
      if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is blocked or full: the session just will not survive a page refresh.
    }
  }
}

/** Reads the `exp` claim of a JWT. Tokens that are not JWTs are never treated as expired. */
export function isTokenExpired(token: string | null, nowMs: number = Date.now()): boolean {
  if (!token) return false;
  const payload = token.split('.')[1];
  if (!payload) return false;
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const exp = JSON.parse(json)?.exp;
    return typeof exp === 'number' && exp * 1000 <= nowMs;
  } catch {
    return false;
  }
}
