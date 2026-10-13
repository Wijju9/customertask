import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";
import { RakeModel } from "../models/rake.model";
import { DataTableRequestModel } from "../models/dataTableRequest.model";



@Injectable({
  providedIn: 'root',
})
export class RakeService extends BaseService {

  Insert(rakeModel: RakeModel): Observable<IResponse<RakeModel>> {
    return this.http.post<IResponse<RakeModel>>(
      `${this.apiBaseUrl}Rake/Insert`,
      rakeModel
    );
  }

  Update(rakeModel: RakeModel): Observable<IResponse<RakeModel>> {
    return this.http.put<IResponse<RakeModel>>(
      `${this.apiBaseUrl}Rake/Update`,
      rakeModel
    );
  }

  GetAll(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<RakeModel[]>> {
    return this.http.post<IResponse<RakeModel[]>>(
      `${this.apiBaseUrl}Rake/GetAll`,
      dataTableRequestModel
    );
  }

  GetSingle(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<RakeModel>> {
    return this.http.post<IResponse<RakeModel>>(
      `${this.apiBaseUrl}Rake/GetSingle`,
      dataTableRequestModel
    );
  }

  GetById(id: any): Observable<IResponse<RakeModel>> {
    return this.http.get<IResponse<RakeModel>>(`${this.apiBaseUrl}Rake/GetById/${id.toString()}`);
  }
}
