import {Pipe, PipeTransform} from '@angular/core';
import {RouteListDataSourceInterface} from '../route-list-data-source-interface';
import {Observable} from 'rxjs';

@Pipe({
  name: 'getDisplayTextContinuous$Pure'
})
export class GetDisplayTextContinuous$PurePipe<DataObjectType> implements PipeTransform {
  transform(
    dataSource: RouteListDataSourceInterface<DataObjectType>,
    dataObject: DataObjectType,
  ): Observable<string> {
    return dataSource.getDisplayTextContinuous$(dataObject);
  }
}
