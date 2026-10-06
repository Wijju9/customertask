import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly errorMessage = signal('');
  protected readonly hidePassword = signal(true);

  /** Ready-made accounts so the demo is easy to try. */
  protected readonly demoAccounts = [
    { label: 'Admin', identifier: 'admin@company.com', password: 'Admin@123' },
    { label: 'Employee', identifier: 'employee1@company.com', password: 'Employee@123' },
  ];

  protected fillDemo(account: { identifier: string; password: string }): void {
    this.form.patchValue(account);
    this.errorMessage.set('');
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { identifier, password } = this.form.getRawValue();
    const error = this.auth.login(identifier, password);

    if (error) {
      this.errorMessage.set(error);
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
