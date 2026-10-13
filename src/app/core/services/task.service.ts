import { Injectable, computed, inject } from '@angular/core';
import { CustomerTask, TaskStatus } from '../models/models';
import { nowLocalIso } from '../utils/date-utils';
import { AuthService } from './auth.service';
import { DbService } from './db.service';

/** The fields a user fills in on the task form. */
export type TaskInput = Pick<
  CustomerTask,
  'name' | 'whatsappNumber' | 'workId' | 'rakeFileId' | 'documents' | 'status' | 'notes' | 'userId'
>;

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly store = inject(DbService);
  private readonly auth = inject(AuthService);

  /** Admins see every task. Employees see only the tasks assigned to them. */
  readonly visibleTasks = computed(() => {
    const tasks = this.store.db().customerTasks;
    const user = this.auth.currentUser();
    return this.auth.isAdmin() ? tasks : tasks.filter((task) => task.userId === user?.Id);
  });

  nameOf(taskId: number): string {
    return this.store.db().customerTasks.find((task) => task.id === taskId)?.name ?? '—';
  }

  add(input: TaskInput): void {
    this.store.update((db) => {
      const task: CustomerTask = {
        ...input,
        id: this.store.nextId(db.customerTasks),
        isActive: true,
        createDate: nowLocalIso(),
      };
      return { ...db, customerTasks: [...db.customerTasks, task] };
    });
  }

  update(id: number, input: TaskInput): void {
    this.patch(id, (task) => ({ ...task, ...input }));
  }

  setStatus(id: number, status: TaskStatus): void {
    this.patch(id, (task) => ({ ...task, status }));
  }

  /** Deleting a task also deletes its appointments. */
  remove(id: number): void {
    this.store.update((db) => ({
      ...db,
      customerTasks: db.customerTasks.filter((task) => task.id !== id),
      appointments: db.appointments.filter((appointment) => appointment.customerId !== id),
    }));
  }

  private patch(id: number, change: (task: CustomerTask) => CustomerTask): void {
    this.store.update((db) => ({
      ...db,
      customerTasks: db.customerTasks.map((task) => (task.id === id ? change(task) : task)),
    }));
  }
}
