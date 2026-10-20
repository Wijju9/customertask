import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";
import { DataTableRequestModel } from "../models/dataTableRequest.model";
import { CustomerModel } from "../models/customer.model";

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {

  Insert(customerModel: CustomerModel): Observable<IResponse<CustomerModel>> {
    return this.http.post<IResponse<CustomerModel>>(
      `${this.apiBaseUrl}customer/Insert`,
      customerModel
    );
  }

  Update(customerModel: CustomerModel): Observable<IResponse<CustomerModel>> {
    return this.http.put<IResponse<CustomerModel>>(
      `${this.apiBaseUrl}customer/Update`,
      customerModel
    );
  }

  GetAll(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<CustomerModel[]>> {
    return this.http.post<IResponse<CustomerModel[]>>(
      `${this.apiBaseUrl}customer/GetAll`,
      dataTableRequestModel
    );
  }

  GetSingle(dataTableRequestModel: DataTableRequestModel): Observable<IResponse<CustomerModel>> {
    return this.http.post<IResponse<CustomerModel>>(
      `${this.apiBaseUrl}customer/GetSingle`,
      dataTableRequestModel
    );
  }

  GetById(id: any): Observable<IResponse<CustomerModel>> {
    return this.http.get<IResponse<CustomerModel>>(`${this.apiBaseUrl}customer/GetById/${id.toString()}`);
  }
}
