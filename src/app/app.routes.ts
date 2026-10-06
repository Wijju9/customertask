import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  // Public pages: login and register share the same two-panel layout.
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
    ],
  },

  // Private pages: everything inside the app shell (sidebar + toolbar).
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      { path: 'tasks', loadComponent: () => import('./features/tasks/tasks').then((m) => m.Tasks) },
      {
        path: 'appointments',
        loadComponent: () => import('./features/appointments/appointments').then((m) => m.Appointments),
      },

      // Admin-only pages. `data` is passed to the component as inputs.
      {
        path: 'works',
        canActivate: [adminGuard],
        data: { key: 'works', label: 'Work' },
        loadComponent: () => import('./features/masters/masters').then((m) => m.Masters),
      },
      {
        path: 'rake-files',
        canActivate: [adminGuard],
        data: { key: 'rakeFiles', label: 'Rake file' },
        loadComponent: () => import('./features/masters/masters').then((m) => m.Masters),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/users/users').then((m) => m.Users),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
