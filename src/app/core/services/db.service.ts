import { Injectable, effect, signal } from '@angular/core';
import { createSeedData } from '../data/seed-data';
import { Database } from '../models/models';

const STORAGE_KEY = 'filedesk_db_v2';

/**
 * The single source of truth for all app data.
 *
 * Data lives in one signal and is saved to localStorage on every change.
 * To move to a real backend later, replace this service (or the feature
 * services that use it) with HTTP calls. The components will not change.
 */
@Injectable({ providedIn: 'root' })
export class DbService {
  private readonly state = signal<Database>(this.load());

  /** Read-only view of the database. */
  readonly db = this.state.asReadonly();

  constructor() {
    effect(() => this.save(this.state()));
  }

  /** Replace the database with a changed copy. Always return a new object. */
  update(change: (db: Database) => Database): void {
    this.state.update(change);
  }

  /** Next free id for a list of records. */
  nextId(items: readonly { id: number }[]): number {
    return Math.max(0, ...items.map((item) => item.id)) + 1;
  }

  /** Throw away all changes and go back to the sample data. */
  reset(): void {
    this.state.set(createSeedData());
  }

  private load(): Database {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Database;
      }
    } catch {
      // Storage is blocked or the saved data is damaged: use the sample data.
    }
    return createSeedData();
  }

  private save(db: Database): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Storage is full or blocked: the app keeps working, it just will not persist.
    }
  }
}
