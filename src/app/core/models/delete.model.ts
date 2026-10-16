import { BaseModel } from './base.model';

export class DeleteModel extends BaseModel {
  TableIds : number | undefined;
  RecordId? : number;
}
