import {BehaviorSubject, Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

export interface RouteListDataSourceInterface<DataObjectType> extends DataSource<DataObjectType> {
  readonly dataObjectTreeBS$: BehaviorSubject<Array<DataObjectType>>;

  getChildList$(dataObject: DataObjectType): Observable<Array<DataObjectType>>;

  // We return BehaviorSubject<string> instead of string, taking into account that app can have reactive localization
  getDisplayTextBS$(dataObject: DataObjectType): BehaviorSubject<string>;

  getSearchResultList$(searchText: string): Observable<Array<DataObjectType>>;

  getUrl$(dataObject: DataObjectType): Observable<string>;

  matchesUrl$(dataObject: DataObjectType, url: string): Observable<boolean>;
}
