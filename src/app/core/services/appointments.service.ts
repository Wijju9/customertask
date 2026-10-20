import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";
import { DataTableRequestModel } from "../models/dataTableRequest.model";
import { AppointmentModel } from "../models/appointment.model";

@Injectable({
  providedIn: 'root',
})
export class AppAppointmentService extends BaseService {

  Insert(appointmentModel: AppointmentModel): Observable<IResponse<AppointmentModel>> {
    return this.http.post<IResponse<AppointmentModel>>(
      `${this.apiBaseUrl}appointment/Insert`,
      appointmentModel
    );
  }

  Update(appointmentModel: AppointmentModel): Observable<IResponse<AppointmentModel>> {
    return this.http.put<IResponse<AppointmentModel>>(
      `${this.apiBaseUrl}appointment/Update`,
      appointmentModel
    );
  }

  GetAll(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<AppointmentModel[]>> {
    return this.http.post<IResponse<AppointmentModel[]>>(
      `${this.apiBaseUrl}appointment/GetAll`,
      dataTableRequestModel
    );
  }

  GetSingle(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<AppointmentModel>> {
    return this.http.post<IResponse<AppointmentModel>>(
      `${this.apiBaseUrl}appointment/GetSingle`,
      dataTableRequestModel
    );
  }

  GetById(id: any): Observable<IResponse<AppointmentModel>> {
    return this.http.get<IResponse<AppointmentModel>>(`${this.apiBaseUrl}appointment/GetById/${id.toString()}`);
  }
}
