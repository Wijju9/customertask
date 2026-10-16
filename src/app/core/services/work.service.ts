import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";
import { DataTableRequestModel } from "../models/dataTableRequest.model";
import { WorkModel } from "../models/work.model";

@Injectable({
  providedIn: 'root',
})
export class WorkService extends BaseService {

  Insert(workModel: WorkModel): Observable<IResponse<WorkModel>> {
    return this.http.post<IResponse<WorkModel>>(
      `${this.apiBaseUrl}Work/Insert`,
      workModel
    );
  }

  Update(workModel: WorkModel): Observable<IResponse<WorkModel>> {
    return this.http.put<IResponse<WorkModel>>(
      `${this.apiBaseUrl}Work/Update`,
      workModel
    );
  }

  GetAll(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<WorkModel[]>> {
    return this.http.post<IResponse<WorkModel[]>>(
      `${this.apiBaseUrl}Work/GetAll`,
      dataTableRequestModel
    );
  }

  GetSingle(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<WorkModel>> {
    return this.http.post<IResponse<WorkModel>>(
      `${this.apiBaseUrl}Work/GetSingle`,
      dataTableRequestModel
    );
  }

  GetById(id: any): Observable<IResponse<WorkModel>> {
    return this.http.get<IResponse<WorkModel>>(`${this.apiBaseUrl}Work/GetById/${id.toString()}`);
  }
}
