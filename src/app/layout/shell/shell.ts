import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ThemePicker } from '../theme-picker/theme-picker';

interface NavLink {
  path: string;
  label: string;
  icon: string;
}

/** The frame around every private page: sidebar, top bar and the page content. */
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ThemePicker,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** True on phones and small tablets, where the sidebar slides over the page. */
  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 800px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  /** Sidebar links. Admins get three extra pages. */
  protected readonly links = computed<NavLink[]>(() => {
    const links: NavLink[] = [
      { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/tasks', label: this.auth.isAdmin() ? 'Customer tasks' : 'My tasks', icon: 'task_alt' },
      { path: '/appointments', label: 'Appointments', icon: 'event' },
    ];
    if (this.auth.isAdmin()) {
      links.push(
        { path: '/works', label: 'Works', icon: 'work' },
        { path: '/rake-files', label: 'Rake files', icon: 'folder_copy' },
        { path: '/users', label: 'Users', icon: 'group' },
      );
    }
    return links;
  });

  protected closeOnMobile(sidenav: MatSidenav): void {
    if (this.isMobile()) sidenav.close();
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
