import { Pipe, PipeTransform } from '@angular/core';
import {RouteListDataSourceInterface} from '../data-source/route-list-data-source-interface';
import {Observable} from 'rxjs';

@Pipe({
  name: 'getChildrenPure'
})
export class GetChildrenPurePipe<DataObjectType> implements PipeTransform {
  transform(
    dataSource: RouteListDataSourceInterface<DataObjectType>,
    dataObject: DataObjectType,
  ): Observable<Array<DataObjectType>> {
    return dataSource.getChildren(dataObject);
  }
}
