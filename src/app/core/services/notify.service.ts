import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * The one place the app shows toast messages (ngx-toastr).
 * Use this instead of injecting ToastrService in features, so look and
 * behaviour stay the same everywhere.
 */
@Injectable({ providedIn: 'root' })
export class NotifyService {
  private readonly toastr = inject(ToastrService);

  success(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  /** Short confirmation, e.g. "Task saved". Same as success(). */
  show(message: string): void {
    this.success(message);
  }
}
