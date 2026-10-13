import { Guid } from 'guid-typescript';

export class CommonFunction {
  public static getGuid(): Guid {
    return Guid.create();
  }

  public static GetLocalVal(key: string) {
    let val = localStorage.getItem(key);
    if (!val || val == 'null') {
      val = null;
    }
    return val; // localStorage.getItem(key);
  }

  public static RemoveFormCRID(val: string | null) {
    const ids = CommonFunction.GetLocalVal('formRequestGUIDs');
    if (ids) {
      const ds = ids.split(',');
      const _ids = ds.filter(function (ele) {
        return ele != val;
      });
      localStorage.setItem('formRequestGUIDs', _ids.join(','));
    }
  }

  public static BindEnumDDL(enumType: Record<string, any>, descEnum: any = null) {
    return Object.keys(enumType)
      .filter(e => !isNaN(+e))
      .map(o => {
        return { Id: +o, Name: descEnum == null ? enumType[o] : descEnum.get(+o) };
      });
  }

  public static getFormattedDateTime(date?: Date): string {
    const now = date || new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }
}
