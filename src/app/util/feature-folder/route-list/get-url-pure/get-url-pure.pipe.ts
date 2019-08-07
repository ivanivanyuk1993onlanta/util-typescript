import {Pipe, PipeTransform} from '@angular/core';
import {RouteListDataSourceInterface} from '../data-source/route-list-data-source-interface';
import {Observable} from 'rxjs';

@Pipe({
  name: 'getUrlPure'
})
export class GetUrlPurePipe<DataObjectType> implements PipeTransform {
  transform(
    dataSource: RouteListDataSourceInterface<DataObjectType>,
    dataObject: DataObjectType,
  ): Observable<string> {
    return dataSource.getUrl(dataObject);
  }
}
