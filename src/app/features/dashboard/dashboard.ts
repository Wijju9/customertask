import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { MasterService } from '../../core/services/master.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { TaskStatus } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, MatCardModule, MatProgressBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly auth = inject(AuthService);
  private readonly tasks = inject(TaskService);
  private readonly masters = inject(MasterService);
  private readonly users = inject(UserService);
  private readonly appointments = inject(AppointmentService);

  protected readonly upcoming = this.appointments.upcoming;

  protected readonly activeEmployeeCount = computed(() => this.users.activeEmployees().length);

  /** The four number cards at the top. */
  protected readonly stats = computed(() => {
    const tasks = this.tasks.visibleTasks();
    const count = (status: TaskStatus) => tasks.filter((task) => task.status === status).length;

    return [
      { label: 'Total tasks', value: tasks.length },
      { label: 'Pending', value: count('Pending') },
      { label: 'In process', value: count('Process') },
      { label: 'Done', value: count('Done') },
    ];
  });

  /** One row per work type, with a bar scaled against the busiest one. */
  protected readonly tasksByWork = computed(() => {
    const tasks = this.tasks.visibleTasks();
    const rows = this.masters.items('works').map((work) => ({
      name: work.name,
      count: tasks.filter((task) => task.workId === work.id).length,
    }));
    const max = Math.max(1, ...rows.map((row) => row.count));
    return rows.map((row) => ({ ...row, percent: (row.count / max) * 100 }));
  });

  protected customerName(taskId: number): string {
    return this.tasks.nameOf(taskId);
  }
}
