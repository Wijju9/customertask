import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MasterItem, MasterKey } from '../../core/models/models';
import { MasterService } from '../../core/services/master.service';
import { ConfirmService } from '../../shared/dialogs/confirm-dialog';
import { PromptService } from '../../shared/dialogs/prompt-dialog';
import { NotifyService } from '../../shared/notify.service';

/**
 * One screen for both "Works" and "Rake files".
 * The route decides which list to show (see `data` in app.routes.ts).
 */
@Component({
  selector: 'app-masters',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './masters.html',
})
export class Masters {
  /** Which list to manage: 'works' or 'rakeFiles'. Comes from the route data. */
  readonly key = input.required<MasterKey>();
  /** Singular display name, e.g. "Work" or "Rake file". Comes from the route data. */
  readonly label = input.required<string>();

  private readonly masters = inject(MasterService);
  private readonly prompt = inject(PromptService);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotifyService);

  protected readonly items = computed(() => this.masters.items(this.key()));
  protected readonly columns = ['name', 'status', 'usage', 'actions'];

  protected usage(item: MasterItem): number {
    return this.masters.usageCount(this.key(), item.id);
  }

  protected add(): void {
    this.prompt
      .ask({ title: `Add ${this.label().toLowerCase()}`, label: 'Name' })
      .subscribe((name) => {
        this.masters.add(this.key(), name);
        this.notify.show(`${this.label()} added`);
      });
  }

  protected rename(item: MasterItem): void {
    this.prompt
      .ask({ title: `Edit ${this.label().toLowerCase()}`, label: 'Name', value: item.name })
      .subscribe((name) => {
        this.masters.rename(this.key(), item.id, name);
        this.notify.show(`${this.label()} updated`);
      });
  }

  protected toggleActive(item: MasterItem): void {
    this.masters.toggleActive(this.key(), item.id);
  }

  protected delete(item: MasterItem): void {
    this.confirm
      .ask({
        title: `Delete ${this.label().toLowerCase()}?`,
        message: `"${item.name}" will be removed.`,
        confirmText: 'Delete',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.masters.remove(this.key(), item.id);
        this.notify.show(`${this.label()} deleted`);
      });
  }
}
