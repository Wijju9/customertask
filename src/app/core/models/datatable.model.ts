export class DataTableRequest {
  limit = 50;
  count!: number;
  offset!: number;
  orderBy!: string;
  orderDir = 'desc';
  pageSize = 10;
  filter!: string;
  pageLimits: number[] = [10, 20, 30, 40, 50];
  filterObj!: object;
  methodName!: string;

  reset() {
    this.offset = 0;
  }

}
