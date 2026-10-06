import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Appointment } from '../../../core/models/models';
import { AppointmentInput } from '../../../core/services/appointment.service';
import { TaskService } from '../../../core/services/task.service';

export interface AppointmentFormData {
  /** The appointment to edit. Leave out to create a new one. */
  appointment?: Appointment;
}

/** Add or edit an appointment. Closes with the form values, or nothing if cancelled. */
@Component({
  selector: 'app-appointment-form-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './appointment-form-dialog.html',
})
export class AppointmentFormDialog {
  private readonly data = inject<AppointmentFormData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<AppointmentFormDialog, AppointmentInput>>(MatDialogRef);

  protected readonly customers = inject(TaskService).visibleTasks;
  protected readonly isEdit = !!this.data.appointment;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    customerId: [this.customers()[0]?.id ?? 0, Validators.required],
    // <input type="datetime-local"> works with "YYYY-MM-DDTHH:mm" (no seconds).
    appointmentDate: ['', Validators.required],
    notes: [''],
  });

  constructor() {
    const appointment = this.data.appointment;
    if (appointment) {
      this.form.patchValue({ ...appointment, appointmentDate: appointment.appointmentDate.slice(0, 16) });
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({ ...value, appointmentDate: `${value.appointmentDate}:00` });
  }
}
