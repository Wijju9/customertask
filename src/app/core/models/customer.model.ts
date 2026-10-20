import { BaseModel } from "./base.model";


export class CustomerModel extends BaseModel {
  Name?: string;
  MobileNo?: string;
  CreatedBy?: number;
}
