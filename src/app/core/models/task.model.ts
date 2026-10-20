import { BaseModel } from "./base.model";
import { LegalDocumentType } from "./enums/legaldocumenttype";
import { TaskStatusType } from "./enums/taskstatustype";


export class TaskModel extends BaseModel {
  WorkId?: number;
  CustomerId?: number;
  CreatedBy?: number;
  RakeId?: number;
  Status?: TaskStatusType;
  FileId?: number;
  CreatedDate?: Date;
  LegalDocuments?: LegalDocumentType[]
  AssignId?: number;
}
