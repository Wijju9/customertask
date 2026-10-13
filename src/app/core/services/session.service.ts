import { computed, inject, Injectable, signal } from "@angular/core";
import { UserModel } from "../models/user.model";
import { LocalStorageService } from "./storage.service";

const STORAGE_KEY = 'filedesk_auth';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private localStorageService = inject(LocalStorageService);
  private readonly state = signal<UserModel | null>(this.read());

  readonly user = computed(() => this.state() ?? null);
  readonly token = computed(() => this.state()?.Token ?? null);
  readonly isLoggedIn = computed(() => this.state() !== null);

  start(user: UserModel, token: string | null): void {
    // const session: StoredSession = { token, user };
    this.state.set(user);
    //this.write(user);

  }


  updateToken(token: string): void {
    const current = this.state();
    if (!current || current.Token === token) return;
    const session = { ...current, Token: token };
    this.state.set(session);
    this.write(session);
  }

  private write(session: UserModel | null): void {
    this.localStorageService.set(STORAGE_KEY, session);
  }

  clear(): void {
    this.state.set(null);
    this.write(null);
    this.localStorageService.remove(STORAGE_KEY);
  }


  validate(): boolean {
    const session = this.state();
    if (!session) return false;
    if (!session.Token) return false;
    if (isTokenExpired(session.Token)) {
      this.clear();
      return false;
    }
    return true;
  }

   private read(): UserModel | null {
    try {
      const saved = this.localStorageService.get(STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved) as UserModel;
      return parsed?.Id != null ? parsed : null;
    } catch {
      return null;
    }
  }

}


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
