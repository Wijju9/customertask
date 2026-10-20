import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";
import { DataTableRequestModel } from "../models/dataTableRequest.model";
import { TaskModel } from "../models/task.model";

@Injectable({
  providedIn: 'root',
})
export class AppTaskService extends BaseService {

  Insert(taskModel: TaskModel): Observable<IResponse<TaskModel>> {
    return this.http.post<IResponse<TaskModel>>(
      `${this.apiBaseUrl}task/Insert`,
      taskModel
    );
  }

  Update(taskModel: TaskModel): Observable<IResponse<TaskModel>> {
    return this.http.put<IResponse<TaskModel>>(
      `${this.apiBaseUrl}task/Update`,
      taskModel
    );
  }

  GetAll(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<TaskModel[]>> {
    return this.http.post<IResponse<TaskModel[]>>(
      `${this.apiBaseUrl}task/GetAll`,
      dataTableRequestModel
    );
  }

  GetSingle(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<TaskModel>> {
    return this.http.post<IResponse<TaskModel>>(
      `${this.apiBaseUrl}task/GetSingle`,
      dataTableRequestModel
    );
  }

  GetById(id: any): Observable<IResponse<TaskModel>> {
    return this.http.get<IResponse<TaskModel>>(`${this.apiBaseUrl}task/GetById/${id.toString()}`);
  }
}
