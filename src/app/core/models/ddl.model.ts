import { TableIds } from "./tableid.enum";

export class DDLModel {
  constructor(tableId: TableIds) {
    this.TableId = tableId;
  }
  Id!: number;
  Name!: string;
  Code!: string;
  TableId!: number;
  filterObj!: object;
  fIds!: number[];
  OtherFields!: string;
  Data!: object;
  DDLSQLType: DDLSQLTypes = DDLSQLTypes.None;
  CacheKeySuffix!: string;
}

export enum DDLSQLTypes {
  None = 0,
  ProductForPricingGroup = 1,
}
