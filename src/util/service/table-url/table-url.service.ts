import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableUrlService {
  public static getTableUrl(
    tableName: string,
  ): string {
    return `${environment.apiUrl}/${environment.tableNameToTableUrlMap[tableName]}`;
  }
}
