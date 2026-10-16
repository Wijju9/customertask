import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly errorMessage = signal('');
  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);

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
    this.auth
      .login(identifier, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl(this.returnUrl()),
        error: () => this.form.controls.password.reset(),
      });

    // this.userService.Login({ Email: identifier, Password: password }).subscribe({
    //   next: (response) => {
    //     console.log('Login response:', response);
    //     if (response.Status) {
    //       // Handle successful login, e.g., store token, navigate to dashboard
    //       //this.router.navigateByUrl('/dashboard');
    //       this.auth.login(response.Data, response.Data.Token);

    //     } else {
    //       this.errorMessage.set(response.Message || 'Login failed. Please try again.');
    //     }
    //   },
    //   error: (err) => {
    //     this.errorMessage.set('An error occurred during login. Please try again later.');
    //   },
    // });

    // const error = this.auth.login(identifier, password);
    // console.log('Login error:', error);
    // if (error) {
    //   // this.errorMessage.set(error.toString());

    // } else {
    //   this.router.navigateByUrl('/dashboard');
    // }

    // this.auth.login(identifier, password)
    //   .subscribe({
    //     next: (response) => {
    //       // console.log('Login response:', response);
    //       if (response.Status) {
    //         this.router.navigateByUrl('/dashboard');
    //       } else {
    //         console.log('Login failed 1 :', response.Message);
    //         this.errorMessage.set(response.Message || 'Login failed. Please try again.');
    //       }
    //     },
    //     error: (err) => {
    //       console.log('Login failed 2 :', err.error.Message);
    //       this.errorMessage.set(err.error.Message.toString());
    //     }
    //   })
  }

  private returnUrl(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/auth') ? url : '/dashboard';
  }
}
