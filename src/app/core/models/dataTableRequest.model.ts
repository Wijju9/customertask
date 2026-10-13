export class DataTableRequestModel {
  public PageSize?: number;
  public Limit?: number;
  public OffSet?: number;
  public OrderDir?: string = '';
  public Filter?: string = '';
  public FilterObj: Record<string, any> = {};
  public IsShowNoData?: boolean = true;
  public GetSetCache?:boolean;
}
