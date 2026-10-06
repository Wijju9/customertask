import { Injectable, inject } from '@angular/core';
import { MasterItem, MasterKey } from '../models/models';
import { DbService } from './db.service';

/**
 * Manages the two lookup lists ("Works" and "Rake files").
 * Both behave the same, so every method takes the list key.
 */
@Injectable({ providedIn: 'root' })
export class MasterService {
  private readonly store = inject(DbService);

  items(key: MasterKey): MasterItem[] {
    return this.store.db()[key];
  }

  activeItems(key: MasterKey): MasterItem[] {
    return this.items(key).filter((item) => item.isActive);
  }

  nameOf(key: MasterKey, id: number): string {
    return this.items(key).find((item) => item.id === id)?.name ?? '—';
  }

  /** How many customer tasks use this item. */
  usageCount(key: MasterKey, id: number): number {
    const field = key === 'works' ? 'workId' : 'rakeFileId';
    return this.store.db().customerTasks.filter((task) => task[field] === id).length;
  }

  add(key: MasterKey, name: string): void {
    this.store.update((db) => ({
      ...db,
      [key]: [...db[key], { id: this.store.nextId(db[key]), name: name.trim(), isActive: true }],
    }));
  }

  rename(key: MasterKey, id: number, name: string): void {
    this.patch(key, id, (item) => ({ ...item, name: name.trim() }));
  }

  toggleActive(key: MasterKey, id: number): void {
    this.patch(key, id, (item) => ({ ...item, isActive: !item.isActive }));
  }

  /** Items that are in use cannot be deleted. Deactivate them instead. */
  remove(key: MasterKey, id: number): void {
    if (this.usageCount(key, id) > 0) return;
    this.store.update((db) => ({ ...db, [key]: db[key].filter((item) => item.id !== id) }));
  }

  private patch(key: MasterKey, id: number, change: (item: MasterItem) => MasterItem): void {
    this.store.update((db) => ({
      ...db,
      [key]: db[key].map((item) => (item.id === id ? change(item) : item)),
    }));
  }
}
