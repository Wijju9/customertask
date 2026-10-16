import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';
import { SessionService } from './session.service';
import { AuthService } from './auth.service';
import { DbService } from './db.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let tasks: TaskService;
  let auth: AuthService;
  let session: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideToastr()] });
    TestBed.inject(DbService).reset();
    tasks = TestBed.inject(TaskService);
    auth = TestBed.inject(AuthService);
    session = TestBed.inject(SessionService);
  });

  const loginAs = (id: number, email: string, isAdmin: boolean) =>
    session.start({ id, name: '', email, mobileNo: '', userType: isAdmin ? 1 : 2, isAdmin }, null);

  it('shows every task to an admin', () => {
    loginAs(1, 'admin@company.com', true);
    expect(tasks.visibleTasks().length).toBe(20);
  });

  it('shows an employee only their own tasks', () => {
    loginAs(2, 'employee1@company.com', false);
    const mine = tasks.visibleTasks();
    expect(mine.length).toBeGreaterThan(0);
    expect(mine.every((task) => task.userId === auth.currentUser()?.id)).toBe(true);
  });

  it('removes appointments when a task is deleted', () => {
    loginAs(1, 'admin@company.com', true);
    const db = TestBed.inject(DbService);
    tasks.remove(1);
    expect(db.db().appointments.some((a) => a.customerId === 1)).toBe(false);
  });
});
