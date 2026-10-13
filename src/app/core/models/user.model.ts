import { BaseModel } from './base.model';

export class LoginModel {
  Email: string | undefined;
  Password: string | undefined;
}

export class UserModel extends BaseModel {
  Email?: string;
  Password?: string;
  Name?: string;
  MobileNo?: string;
  DepartmentId?: number;
  Address?: string;
  Status?: number;
  IsAdmin?: boolean;
  UserType?: number;
  Token?: string;
}
