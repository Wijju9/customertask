import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { DbService } from './db.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let tasks: TaskService;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    TestBed.inject(DbService).reset();
    tasks = TestBed.inject(TaskService);
    auth = TestBed.inject(AuthService);
  });

  it('shows every task to an admin', () => {
    expect(auth.login('admin@company.com', 'Admin@123')).toBeNull();
    expect(tasks.visibleTasks().length).toBe(20);
  });

  it('shows an employee only their own tasks', () => {
    auth.login('employee1@company.com', 'Employee@123');
    const mine = tasks.visibleTasks();
    expect(mine.length).toBeGreaterThan(0);
    expect(mine.every((task) => task.userId === auth.currentUser()?.id)).toBe(true);
  });

  it('removes appointments when a task is deleted', () => {
    auth.login('admin@company.com', 'Admin@123');
    const db = TestBed.inject(DbService);
    tasks.remove(1);
    expect(db.db().appointments.some((a) => a.customerId === 1)).toBe(false);
  });

  it('rejects a wrong password', () => {
    expect(auth.login('admin@company.com', 'nope')).toContain('incorrect');
  });
});
