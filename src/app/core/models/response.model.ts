export interface IResponse<T> {
  ReqId: string;
  Status: boolean
  Data?: T;
  Message?: string;
  StatusCode?: number;
}
