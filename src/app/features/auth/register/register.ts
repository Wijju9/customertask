import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import {
  MIN_PASSWORD_LENGTH,
  MOBILE_PATTERN,
  emailAvailable,
  mobileAvailable,
  passwordsMatch,
} from '../../../core/validators/form-validators';
import { NotifyService } from '../../../shared/notify.service';
import { UserType } from '../../../core/models/models';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss',
})
export class Register {
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotifyService);

  protected readonly minPasswordLength = MIN_PASSWORD_LENGTH;

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      mobileNo: ['', [Validators.required, Validators.pattern(MOBILE_PATTERN), mobileAvailable(this.users)]],
      email: ['', [Validators.required, Validators.email, emailAvailable(this.users)]],
      password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { mobileNo, email, password } = this.form.getRawValue();
    this.users.addEmployee({ mobileNo, email, password });


    this.users.Insert({ Email: email, Password: password, MobileNo : mobileNo, Name : "Test" ,IsAdmin : true, UserType : UserType.Admin }).subscribe({
      next: (response) => {
        if (response.Status) {
          // Handle successful login, e.g., store token, navigate to dashboard
          this.router.navigateByUrl('/dashboard');
        } else {

        }
      },
      error: (err) => {

      },
    });

    // this.notify.show('Registered. Please log in.');
    // this.router.navigateByUrl('/auth/login');
  }
}
