import { Injectable, computed, inject } from '@angular/core';
import { Appointment } from '../models/models';
import { startOfToday } from '../utils/date-utils';
import { AuthService } from './auth.service';
import { DbService } from './db.service';
import { TaskService } from './task.service';

export type AppointmentInput = Pick<Appointment, 'customerId' | 'appointmentDate' | 'notes'>;

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly store = inject(DbService);
  private readonly auth = inject(AuthService);
  private readonly tasks = inject(TaskService);

  /** Admins see all appointments. Employees see those for their own customers. */
  readonly visibleAppointments = computed(() => {
    const all = this.store.db().appointments;
    if (this.auth.isAdmin()) return all;
    const myTaskIds = new Set(this.tasks.visibleTasks().map((task) => task.id));
    return all.filter((appointment) => myTaskIds.has(appointment.customerId));
  });

  /** Earliest first. */
  readonly sorted = computed(() =>
    [...this.visibleAppointments()].sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate)),
  );

  /** Appointments from today onwards. */
  readonly upcoming = computed(() => {
    const today = startOfToday().getTime();
    return this.sorted().filter((appointment) => new Date(appointment.appointmentDate).getTime() >= today);
  });

  add(input: AppointmentInput): void {
    this.store.update((db) => {
      const appointment: Appointment = {
        ...input,
        id: this.store.nextId(db.appointments),
        adminId: this.auth.currentUser()?.id ?? 1,
        isActive: true,
      };
      return { ...db, appointments: [...db.appointments, appointment] };
    });
  }

  update(id: number, input: AppointmentInput): void {
    this.store.update((db) => ({
      ...db,
      appointments: db.appointments.map((a) => (a.id === id ? { ...a, ...input } : a)),
    }));
  }

  remove(id: number): void {
    this.store.update((db) => ({ ...db, appointments: db.appointments.filter((a) => a.id !== id) }));
  }
}
