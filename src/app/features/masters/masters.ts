import { ChangeDetectorRef, Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MasterItem, MasterKey } from '../../core/models/models';
import { MasterService } from '../../core/services/master.service';
import { ConfirmService } from '../../shared/dialogs/confirm-dialog';
import { PromptService } from '../../shared/dialogs/prompt-dialog';
import { NotifyService } from '../../shared/notify.service';
import { RakeModel } from '../../core/models/rake.model';
import { RakeService } from '../../core/services/rake.service';
import { DataTableRequestModel } from '../../core/models/dataTableRequest.model';
import { CommonService } from '../../core/services/common.service';
import { TableIds } from '../../core/models/tableid.enum';
import { WorkService } from '../../core/services/work.service';
import { ActivatedRoute } from '@angular/router';

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
  //readonly key = input.required<TableIds>();
  /** Singular display name, e.g. "Work" or "Rake file". Comes from the route data. */
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  readonly key = this.route.snapshot.data['key'] as TableIds;

  readonly label = input.required<string>();

  dataTableRequestModel = new DataTableRequestModel();

  private readonly masters = inject(MasterService);
  private readonly prompt = inject(PromptService);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotifyService);
  private readonly rakeService = inject(RakeService);
  private readonly commonService = inject(CommonService);
  private readonly workService = inject(WorkService);

  //protected readonly items = computed(() => this.masters.items(this.key()));
  protected readonly columns = ['name', 'status', 'actions'];
  // protected readonly items : RakeModel[] = [];
  protected readonly items = signal<RakeModel[]>([]);

  constructor() {
    this.getData();
  }

  // protected usage(item: MasterItem): number {
  //   return this.masters.usageCount(this.key(), item.id);
  // }

  protected add(): void {
    this.prompt
      .ask({ title: `Add ${this.label().toLowerCase()}`, label: 'Name' })
      .subscribe((name) => {
        // this.masters.add(this.key(), name);
        this.insertUpdateApi({ Name: name ,Id : 0 })
        //this.notify.show(`${this.label()} added`);
      });
  }

  protected rename(item: any): void {
    this.prompt
      .ask({ title: `Edit ${this.label().toLowerCase()}`, label: 'Name', value: item.Name })
      .subscribe((name) => {
        // this.masters.rename(this.key(), item.id, name);
        console.log("Rename", name)
        this.insertUpdateApi({ Name: name, Id: item.Id });

        // this.rakeService.Update({ Name: name, Id: item.Id }).subscribe((response) => {
        //   if (response.Status) {
        //     console.log('Rake added:', response.Data);
        //     this.getData(); // Refresh the list after adding
        //   } else {
        //     this.notify.show(response.Message || 'Failed to add Rake');
        //     console.error('Failed to add Rake:', response.Message);
        //   }
        // });

        this.notify.show(`${this.label()} updated`);
      });
  }

  protected toggleActive(item: any): void {
    //this.masters.toggleActive(this.key(), item.id);
    this.DeleteApi({ Id: item.Id })
    // this.commonService.Delete({ TableIds: TableIds.Rake, IsActive: false, Id: item.Id }).subscribe((response) => {
    //   if (response.Status) {
    //     //console.log('Rake added:', response.Data);
    //     this.notify.success(response.Message || 'Delete Success')
    //     this.getData(); // Refresh the list after adding
    //   } else {
    //     this.notify.show(response.Message || 'Failed to add Rake');
    //     console.error('Failed to add Rake:', response.Message);
    //   }
    // });
  }

  protected delete(item: any): void {
    this.confirm
      .ask({
        title: `Delete ${this.label().toLowerCase()}?`,
        message: `"${item.Name}" will be removed.`,
        confirmText: 'Delete',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.DeleteApi({ Id: item.Id })
      });
  }

  protected getData() {
    this.dataTableRequestModel.FilterObj = { ...this.dataTableRequestModel.FilterObj, IsActive: true }
    let service;
    switch (parseInt(this.key.toString())) {
      case TableIds.Rake:
        service = this.rakeService;
        break;

      case TableIds.Work:
        service = this.workService;
        break;

      default:
        return;
    }
    service.GetAll({ ...this.dataTableRequestModel }).subscribe((response) => {
      if (response.Status) {
        const data = response.Data as any;
        this.items.set(data.Data); // Add the new items
      } else {
        console.error('Failed to fetch Rake data:', response.Message);
      }
    });
  }


  protected insertUpdateApi(item: any) {
    let service;

    switch (parseInt(this.key.toString())) {
      case TableIds.Rake:
        service = this.rakeService;
        break;

      case TableIds.Work:
        service = this.workService;
        break;

      default:
        return;
    }
    console.log("update ", {...item});
    item.Id == 0 ?
      service.Insert({ Name: item.Name }).subscribe({
        next: (response: any) => {
          if (response.Status) {
            this.getData(); // Refresh table data
          } else {
            console.error('Insert/Update failed:', response.Message);
          }
        },
        error: (error: any) => {
          console.error('API error:', error);
        }
      })
      : service.Update({ Name: item.Name, Id: item.Id }).subscribe({
        next: (response: any) => {
          if (response.Status) {
            this.getData(); // Refresh table data
          } else {
            console.error('Insert/Update failed:', response.Message);
          }
        },
        error: (error: any) => {
          console.error('API error:', error);
        }
      })
  }

  // this.rakeService.Insert({ Name: item.name }).subscribe((response) => {
  //   if (response.Status) {
  //     console.log('Rake added:', response.Data);
  //     this.getData(); // Refresh the list after adding
  //   } else {
  //     this.notify.show(response.Message || 'Failed to add Rake');
  //     console.error('Failed to add Rake:', response.Message);
  //   }
  // });

  protected DeleteApi(item: any) {
    let tablesId = 0

    switch (parseInt(this.key.toString())) {
      case TableIds.Rake:
        tablesId = TableIds.Rake
        break;

      case TableIds.Work:
        tablesId = TableIds.Work
        break;

      default:
        return;
    }

    this.commonService.Delete({ TableIds: tablesId, IsActive: false, Id: item.Id }).subscribe((response) => {
      if (response.Status) {
        this.notify.success(response.Message || 'Delete Success')
        this.getData(); // Refresh the list after adding
      } else {
        this.notify.show(response.Message || 'Failed to add Rake');
        console.error('Failed to add Rake:', response.Message);
      }
    });
  }
}
