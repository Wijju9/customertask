import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../services/user.service';

/** Indian mobile number: 10 digits starting with 6, 7, 8 or 9. */
export const MOBILE_PATTERN = /^[6-9]\d{9}$/;

/** WhatsApp number typed without the country code: any 10 digits. */
export const WHATSAPP_PATTERN = /^\d{10}$/;

export const MIN_PASSWORD_LENGTH = 6;

/** Fails with `{ mobileTaken: true }` when another user already has this number. */
export function mobileAvailable(users: UserService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value && users.mobileExists(control.value) ? { mobileTaken: true } : null;
}

/** Fails with `{ emailTaken: true }` when another user already has this email. */
export function emailAvailable(users: UserService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value && users.emailExists(control.value) ? { emailTaken: true } : null;
}

/** Group validator: `password` and `confirmPassword` must be equal. */
export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
};
