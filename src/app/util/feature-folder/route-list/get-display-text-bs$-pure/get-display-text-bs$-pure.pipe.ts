import {Pipe, PipeTransform} from '@angular/core';
import {RouteListDataSourceInterface} from '../data-source/route-list-data-source-interface';
import {BehaviorSubject} from 'rxjs';

@Pipe({
  name: 'getDisplayTextBS$Pure'
})
export class GetDisplayTextBS$PurePipe<DataObjectType> implements PipeTransform {
  transform(
    dataSource: RouteListDataSourceInterface<DataObjectType>,
    dataObject: DataObjectType,
  ): BehaviorSubject<string> {
    return dataSource.getDisplayTextBS$(dataObject);
  }
}
