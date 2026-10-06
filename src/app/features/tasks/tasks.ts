import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerTask, TASK_STATUSES, TaskStatus } from '../../core/models/models';
import { AuthService } from '../../core/services/auth.service';
import { MasterService } from '../../core/services/master.service';
import { TaskInput, TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { ConfirmService } from '../../shared/dialogs/confirm-dialog';
import { NotifyService } from '../../shared/notify.service';
import { TaskFormData, TaskFormDialog } from './task-form-dialog/task-form-dialog';

@Component({
  selector: 'app-tasks',
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './tasks.html',
})
export class Tasks {
  protected readonly auth = inject(AuthService);
  private readonly tasks = inject(TaskService);
  private readonly masters = inject(MasterService);
  private readonly users = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotifyService);

  protected readonly statuses = TASK_STATUSES;

  // Filter state. Changing either one re-runs `filteredTasks` automatically.
  protected readonly search = signal('');
  protected readonly statusFilter = signal<TaskStatus | ''>('');

  protected readonly filteredTasks = computed(() => {
    const text = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return this.tasks
      .visibleTasks()
      .filter((task) => !status || task.status === status)
      .filter((task) => !text || `${task.name} ${task.whatsappNumber} ${task.notes}`.toLowerCase().includes(text))
      .sort((a, b) => b.id - a.id); // newest first
  });

  /** Only admins see the "Assigned to" column. */
  protected readonly columns = computed(() => {
    const base = ['customer', 'work', 'documents', 'status'];
    const admin = this.auth.isAdmin() ? ['assignedTo'] : [];
    return [...base, ...admin, 'created', 'actions'];
  });

  protected workName(task: CustomerTask): string {
    return this.masters.nameOf('works', task.workId);
  }

  protected rakeFileName(task: CustomerTask): string {
    return this.masters.nameOf('rakeFiles', task.rakeFileId);
  }

  protected assignedTo(task: CustomerTask): string {
    return this.users.label(task.userId);
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected setStatus(task: CustomerTask, status: TaskStatus): void {
    if (task.status === status) return;
    this.tasks.setStatus(task.id, status);
    this.notify.show('Status updated');
  }

  /** Opens the form. Pass a task to edit it, or nothing to add a new one. */
  protected openForm(task?: CustomerTask): void {
    this.dialog
      .open<TaskFormDialog, TaskFormData, TaskInput>(TaskFormDialog, {
        data: { task },
        width: '560px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((input) => {
        if (!input) return; // cancelled
        if (task) this.tasks.update(task.id, input);
        else this.tasks.add(input);
        this.notify.show('Task saved');
      });
  }

  protected delete(task: CustomerTask): void {
    this.confirm
      .ask({
        title: 'Delete task?',
        message: `"${task.name}" and its appointments will be removed.`,
        confirmText: 'Delete',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.tasks.remove(task.id);
        this.notify.show('Task deleted');
      });
  }
}
