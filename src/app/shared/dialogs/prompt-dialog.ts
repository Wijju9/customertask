import { Component, Injectable, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, filter } from 'rxjs';

export interface PromptData {
  title: string;
  label: string;
  value?: string;
  inputType?: 'text' | 'password';
  minLength?: number;
  confirmText?: string;
}

/** A small dialog that asks for one text value. */
@Component({
  selector: 'app-prompt-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <mat-form-field class="full-width">
          <mat-label>{{ data.label }}</mat-label>
          <input matInput formControlName="value" [type]="data.inputType ?? 'text'" cdkFocusInitial />
          @if (form.controls.value.hasError('required')) {
            <mat-error>This field is required</mat-error>
          } @else if (form.controls.value.hasError('minlength')) {
            <mat-error>Use at least {{ data.minLength }} characters</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button type="submit">{{ data.confirmText ?? 'Save' }}</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class PromptDialog {
  protected readonly data = inject<PromptData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<PromptDialog, string>>(MatDialogRef);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    value: [this.data.value ?? '', [Validators.required, Validators.minLength(this.data.minLength ?? 0)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.controls.value.value.trim());
  }
}

/** Usage: `prompt.ask({ title, label }).subscribe(text => ...)` (emits only when saved). */
@Injectable({ providedIn: 'root' })
export class PromptService {
  private readonly dialog = inject(MatDialog);

  ask(data: PromptData): Observable<string> {
    return this.dialog
      .open<PromptDialog, PromptData, string>(PromptDialog, { data, width: '420px', maxWidth: '95vw' })
      .afterClosed()
      .pipe(filter((value): value is string => !!value));
  }
}
