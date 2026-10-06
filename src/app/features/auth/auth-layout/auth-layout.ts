import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemePicker } from '../../../layout/theme-picker/theme-picker';

/** Two-panel page around login and register: brand on the left, form on the right. */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, ThemePicker],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  protected readonly services = ['Passport', 'Visa', 'Income Tax', 'GST', 'Company'];
}
