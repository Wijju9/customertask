import { Injectable, computed, inject } from '@angular/core';
import { User, UserType } from '../models/models';
import { DbService } from './db.service';

export interface NewEmployee {
  mobileNo: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly store = inject(DbService);

  readonly users = computed(() => this.store.db().users);

  /** Active employees, e.g. for the "Assign to" dropdown. */
  readonly activeEmployees = computed(() =>
    this.users().filter((user) => user.userType === UserType.Employee && user.isActive),
  );

  /** Short name shown in tables: "Admin" or the part of the email before "@". */
  label(userId: number): string {
    const user = this.users().find((u) => u.id === userId);
    if (!user) return '—';
    return user.userType === UserType.Admin ? 'Admin' : user.email.split('@')[0];
  }

  taskCount(userId: number): number {
    return this.store.db().customerTasks.filter((task) => task.userId === userId).length;
  }

  mobileExists(mobileNo: string): boolean {
    return this.users().some((user) => user.mobileNo === mobileNo.trim());
  }

  emailExists(email: string): boolean {
    const wanted = email.trim().toLowerCase();
    return this.users().some((user) => user.email.toLowerCase() === wanted);
  }

  addEmployee(input: NewEmployee): void {
    this.store.update((db) => {
      const user: User = {
        id: this.store.nextId(db.users),
        mobileNo: input.mobileNo.trim(),
        email: input.email.trim(),
        password: input.password,
        userType: UserType.Employee,
        isActive: true,
      };
      return { ...db, users: [...db.users, user] };
    });
  }

  toggleActive(userId: number): void {
    this.patch(userId, (user) => ({ ...user, isActive: !user.isActive }));
  }

  resetPassword(userId: number, password: string): void {
    this.patch(userId, (user) => ({ ...user, password }));
  }

  private patch(userId: number, change: (user: User) => User): void {
    this.store.update((db) => ({
      ...db,
      users: db.users.map((user) => (user.id === userId ? change(user) : user)),
    }));
  }
}
