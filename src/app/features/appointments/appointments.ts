import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Appointment } from '../../core/models/models';
import { AppointmentInput, AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { ConfirmService } from '../../shared/dialogs/confirm-dialog';
import { NotifyService } from '../../shared/notify.service';
import {
  AppointmentFormData,
  AppointmentFormDialog,
} from './appointment-form-dialog/appointment-form-dialog';

@Component({
  selector: 'app-appointments',
  imports: [DatePipe, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './appointments.html',
})
export class Appointments {
  protected readonly auth = inject(AuthService);
  private readonly appointments = inject(AppointmentService);
  private readonly tasks = inject(TaskService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotifyService);

  protected readonly list = this.appointments.sorted;

  /** Only admins can change appointments, so only they get the actions column. */
  protected readonly columns = computed(() =>
    this.auth.isAdmin() ? ['when', 'customer', 'notes', 'actions'] : ['when', 'customer', 'notes'],
  );

  protected customerName(appointment: Appointment): string {
    return this.tasks.nameOf(appointment.customerId);
  }

  /** Opens the form. Pass an appointment to edit it, or nothing to add a new one. */
  protected openForm(appointment?: Appointment): void {
    this.dialog
      .open<AppointmentFormDialog, AppointmentFormData, AppointmentInput>(AppointmentFormDialog, {
        data: { appointment },
        width: '480px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((input) => {
        if (!input) return; // cancelled
        if (appointment) this.appointments.update(appointment.id, input);
        else this.appointments.add(input);
        this.notify.show('Appointment saved');
      });
  }

  protected delete(appointment: Appointment): void {
    this.confirm
      .ask({
        title: 'Delete appointment?',
        message: `The appointment with ${this.customerName(appointment)} will be removed.`,
        confirmText: 'Delete',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.appointments.remove(appointment.id);
        this.notify.show('Appointment deleted');
      });
  }
}
