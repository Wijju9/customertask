import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { DeleteModel } from '../models/delete.model';
import { IResponse } from '../models/response.model';
import { DDLModel } from '../models/ddl.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService extends BaseService {

  Delete(activeDeActiveModel: DeleteModel): Observable<IResponse<any>> {
    return this.http.post<IResponse<DeleteModel>>(
      `${this.apiBaseUrl}Common/ActiveDeActive`,
      activeDeActiveModel
    );
  }

  GetSingleDDL(ddlModel: DDLModel): Observable<IResponse<DDLModel[]>> {
    return this.http.post<IResponse<DDLModel[]>>(
      `${this.apiBaseUrl}Common/GetSingleDDL`,
      ddlModel
    )
  }

  GetAllDDL(ddlModels: DDLModel[]): Observable<IResponse<DDLModel[]>> {
    return this.http.post<IResponse<DDLModel[]>>(
      `${this.apiBaseUrl}Common/GetAllDDL`,
      ddlModels
    )
  }
}
