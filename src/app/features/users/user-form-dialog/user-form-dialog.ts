import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewEmployee, UserService } from '../../../core/services/user.service';
import {
  MIN_PASSWORD_LENGTH,
  MOBILE_PATTERN,
  emailAvailable,
  mobileAvailable,
} from '../../../core/validators/form-validators';

/** Add an employee. Closes with the form values, or nothing if cancelled. */
@Component({
  selector: 'app-user-form-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './user-form-dialog.html',
})
export class UserFormDialog {
  private readonly users = inject(UserService);
  private readonly dialogRef = inject<MatDialogRef<UserFormDialog, NewEmployee>>(MatDialogRef);

  protected readonly minPasswordLength = MIN_PASSWORD_LENGTH;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name:['', [Validators.required,  mobileAvailable(this.users)]],
    mobileNo: ['', [Validators.required, Validators.pattern(MOBILE_PATTERN), mobileAvailable(this.users)]],
    email: ['', [Validators.required, Validators.email, emailAvailable(this.users)]],
    password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
