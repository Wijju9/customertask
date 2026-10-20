import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User, UserType } from '../../core/models/models';
import { AuthService } from '../../core/services/auth.service';
import { NewEmployee, UserService } from '../../core/services/user.service';
import { MIN_PASSWORD_LENGTH } from '../../core/validators/form-validators';
import { PromptService } from '../../shared/dialogs/prompt-dialog';
import { NotifyService } from '../../shared/notify.service';
import { UserFormDialog } from './user-form-dialog/user-form-dialog';
import { DataTableRequestModel } from '../../core/models/dataTableRequest.model';
import { UserModel } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './users.html',
})
export class Users {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly prompt = inject(PromptService);
  private readonly notify = inject(NotifyService);

  //protected readonly users = this.userService.users;
  protected readonly items = signal<UserModel[]>([]);
  protected readonly columns = ['Mobile', 'Email', 'Name', 'Status', 'Actions'];
  dataTableRequestModel = new DataTableRequestModel();

  constructor() {
    this.getAllUser();
  }

  protected roleName(user: User): string {
    return user.userType === UserType.Admin ? 'Admin' : 'Employee';
  }

  protected taskCount(user: User): number {
    return this.userService.taskCount(user.id);
  }

  /** You cannot deactivate or reset your own account from this screen. */
  protected isMe(user: User): boolean {
    return user.id === this.auth.currentUser()?.id;
  }

  protected addEmployee(): void {
    this.dialog
      .open<UserFormDialog, void, NewEmployee>(UserFormDialog, { width: '480px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((employee) => {
        if (!employee) return; // cancelled
        //this.userService.addEmployee(employee);
        this.userService.Insert({
          Email: employee.email, MobileNo: employee.mobileNo, Name: employee.name,
          Password: employee.password, IsAdmin: false, IsActive: true, UserType: UserType.Employee,
        }).subscribe({
          next: (response: any) => {
            if (response.Status) {
              this.getAllUser()
              this.notify.show('Employee added');
            } else {
              console.error('Insert/Update failed:', response.Message);
            }
          },
          error: (error: any) => {
            console.error('API error:', error);
          }
        })
      });
  }

  protected toggleActive(user: User): void {
    this.userService.toggleActive(user.id);
  }

  protected resetPassword(user: User): void {
    this.prompt
      .ask({
        title: 'Reset password',
        label: `New password for ${user.email}`,
        inputType: 'password',
        minLength: MIN_PASSWORD_LENGTH,
      })
      .subscribe((password) => {
        this.userService.resetPassword(user.id, password);
        this.notify.show('Password updated');
      });
  }

  protected getAllUser() {
    this.dataTableRequestModel.FilterObj = { ...this.dataTableRequestModel.FilterObj, IsActive: true, IsAdmin: true}
    this.userService.GetAll({ ...this.dataTableRequestModel }).subscribe((response) => {
      if (response.Status) {
        const data = response.Data as any;
        this.items.set(data.Data); // Add the new items
      } else {
        console.error('Failed to fetch Rake data:', response.Message);
      }
    });
  }
}
