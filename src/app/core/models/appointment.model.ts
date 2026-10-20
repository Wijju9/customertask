import { BaseModel } from "./base.model";

export class AppointmentModel extends BaseModel {
  CreatedBy?: number;
  CreatedDate?: Date;
  Notes?: string;
  CustomerId?: number;
  UserId?: number;
}
