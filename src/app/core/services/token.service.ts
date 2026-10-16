import { inject, Injectable, OnDestroy } from "@angular/core";
import { LocalStorageService } from "./storage.service";

@Injectable({
  providedIn: 'root',
})
export class TokenService implements OnDestroy {

  public readonly key = 'filedesk_token';
  private readonly store = inject(LocalStorageService);

  ngOnDestroy(): void {
    // Cleanup if necessary
  }

  private get token(): string | null {
    return this.store.get(this.key) || null;
  }

  private set token(value: string | null) {
    if (value) {
      this.store.set(this.key, value);
    }
  }

  getBearerToken(): string {
    const token = this.token;
    return token ? `Bearer ${token}` : '';
  }


  valid() {
    const token = this.token;
    return !!token;
  }

  clear() {
    this.store.remove(this.key);
  }
}
