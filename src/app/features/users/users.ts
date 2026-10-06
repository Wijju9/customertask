import { Component, inject } from '@angular/core';
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

  protected readonly users = this.userService.users;
  protected readonly columns = ['mobile', 'email', 'role', 'tasks', 'status', 'actions'];

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
        this.userService.addEmployee(employee);
        this.notify.show('Employee added');
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
}
