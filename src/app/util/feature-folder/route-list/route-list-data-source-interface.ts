import {BehaviorSubject} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

export interface RouteListDataSourceInterface<DataObjectType> extends DataSource<DataObjectType> {
  dataObjectListBS$: BehaviorSubject<DataObjectType>;

  // We return BehaviorSubject<string> instead of string, taking into account that app can have reactive localization
  getDisplayText(dataObject: DataObjectType): BehaviorSubject<string>;
}
