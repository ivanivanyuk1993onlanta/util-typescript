import {Pipe, PipeTransform} from '@angular/core';
import {RouteListDataSourceInterface} from '../data-source/route-list-data-source-interface';
import {Observable} from 'rxjs';

@Pipe({
  name: 'getIconCode$Pure'
})
export class GetIconCode$PurePipe<DataObjectType> implements PipeTransform {

  transform(
    dataSource: RouteListDataSourceInterface<DataObjectType>,
    dataObject: DataObjectType,
  ): Observable<string> {
    return dataSource.getIconCode$(dataObject);
  }

}
