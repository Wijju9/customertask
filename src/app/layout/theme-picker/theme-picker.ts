import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PALETTES, ThemeMode, ThemeService } from '../../core/services/theme.service';

/** A palette button that opens a menu to pick light/dark mode and a brand colour. */
@Component({
  selector: 'app-theme-picker',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, MatTooltipModule],
  templateUrl: './theme-picker.html',
  styleUrl: './theme-picker.scss',
})
export class ThemePicker {
  protected readonly theme = inject(ThemeService);
  protected readonly palettes = PALETTES;

  protected readonly modes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'Auto', icon: 'brightness_auto' },
  ];
}
