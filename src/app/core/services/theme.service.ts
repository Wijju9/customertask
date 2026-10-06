import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

/** Colour palettes. Each `id` has a matching block in src/styles.scss. */
export const PALETTES = [
  { id: 'emerald', label: 'Emerald', swatch: '#006d33' },
  { id: 'azure', label: 'Azure', swatch: '#005cbb' },
  { id: 'violet', label: 'Violet', swatch: '#7d00fa' },
  { id: 'rose', label: 'Rose', swatch: '#ba005c' },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

const MODE_KEY = 'filedesk_theme_mode';
const PALETTE_KEY = 'filedesk_theme_palette';

/**
 * Handles the two theme choices:
 *  - mode: light, dark, or follow the device ("system")
 *  - palette: the brand colour
 *
 * Both are written onto the <html> element, where styles.scss picks them up.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly html = inject(DOCUMENT).documentElement;

  readonly mode = signal<ThemeMode>(this.read<ThemeMode>(MODE_KEY, ['light', 'dark', 'system'], 'system'));
  readonly palette = signal<PaletteId>(
    this.read<PaletteId>(PALETTE_KEY, PALETTES.map((p) => p.id), 'emerald'),
  );

  constructor() {
    effect(() => {
      const mode = this.mode();
      // "light dark" tells the browser to follow the device setting.
      this.html.style.colorScheme = mode === 'system' ? 'light dark' : mode;
      this.write(MODE_KEY, mode);
    });

    effect(() => {
      const palette = this.palette();
      this.html.dataset['palette'] = palette;
      this.write(PALETTE_KEY, palette);
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  setPalette(palette: PaletteId): void {
    this.palette.set(palette);
  }

  private read<T extends string>(key: string, allowed: readonly string[], fallback: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved && allowed.includes(saved) ? (saved as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore: the choice just will not survive a page refresh.
    }
  }
}
