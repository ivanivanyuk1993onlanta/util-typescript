import {BehaviorSubject, Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

export interface RouteListDataSourceInterface<DataObjectType> extends DataSource<DataObjectType> {
  readonly dataObjectTreeBS$: BehaviorSubject<Array<DataObjectType>>;

  getChildList$(dataObject: DataObjectType): Observable<Array<DataObjectType>>;

  // We return continuous observable, taking into account that app can have reactive localization
  getDisplayTextContinuous$(dataObject: DataObjectType): Observable<string>;

  getIconCode$(dataObject: DataObjectType): Observable<string>;

  getSearchResultList$(searchText: string): Observable<Array<DataObjectType>>;

  getUrl$(dataObject: DataObjectType): Observable<string>;

  matchesUrl$(dataObject: DataObjectType, url: string): Observable<boolean>;
}
