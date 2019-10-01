import { Pipe, PipeTransform } from '@angular/core';
import {RouteListDataSourceInterface} from '../route-list-data-source-interface';

@Pipe({
  name: 'hasChildList$Pure'
})
export class HasChildList$PurePipe<DataObjectType> implements PipeTransform {
  transform(
    routeListDataSource: RouteListDataSourceInterface<DataObjectType>,
    dataObject: DataObjectType,
  ) {
    return routeListDataSource.hasChildList$(dataObject);
  }
}
