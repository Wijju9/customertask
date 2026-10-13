import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomerTask, DOCUMENT_NUMBERS, MasterKey, TASK_STATUSES, TaskStatus } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { MasterService } from '../../../core/services/master.service';
import { TaskInput } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { WHATSAPP_PATTERN } from '../../../core/validators/form-validators';

export interface TaskFormData {
  /** The task to edit. Leave out to create a new one. */
  task?: CustomerTask;
}

/** Add or edit a customer task. Closes with the form values, or nothing if cancelled. */
@Component({
  selector: 'app-task-form-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './task-form-dialog.html',
})
export class TaskFormDialog {
  private readonly data = inject<TaskFormData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<TaskFormDialog, TaskInput>>(MatDialogRef);
  private readonly masters = inject(MasterService);
  private readonly auth = inject(AuthService);
  protected readonly users = inject(UserService);

  protected readonly isEdit = !!this.data.task;
  protected readonly isAdmin = this.auth.isAdmin;

  protected readonly statuses = TASK_STATUSES;
  protected readonly documentNumbers = DOCUMENT_NUMBERS;

  protected readonly works = computed(() => this.optionsFor('works', this.data.task?.workId));
  protected readonly rakeFiles = computed(() => this.optionsFor('rakeFiles', this.data.task?.rakeFileId));

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    whatsappNumber: ['', [Validators.required, Validators.pattern(WHATSAPP_PATTERN)]],
    workId: [this.masters.activeItems('works')[0]?.id ?? 0, Validators.required],
    rakeFileId: [this.masters.activeItems('rakeFiles')[0]?.id ?? 0, Validators.required],
    documents: [[] as number[]],
    status: ['Pending' as TaskStatus],
    userId: [this.auth.currentUser()?.Id ?? 0],
    notes: [''],
  });

  constructor() {
    if (this.data.task) {
      this.form.patchValue(this.data.task);
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  /** Active items, plus the one already chosen (it may have been deactivated since). */
  private optionsFor(key: MasterKey, selectedId?: number) {
    return this.masters.items(key).filter((item) => item.isActive || item.id === selectedId);
  }
}
