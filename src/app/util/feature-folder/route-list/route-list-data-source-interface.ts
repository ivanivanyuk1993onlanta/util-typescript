import {BehaviorSubject} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

export interface RouteListDataSourceInterface<DataObjectType> extends DataSource<DataObjectType> {
  dataObjectListBS$: BehaviorSubject<DataObjectType>;

  getDisplayText(
    dataObject: DataObjectType,
  ): BehaviorSubject<string>;
}
