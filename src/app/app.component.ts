import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ROUTE_LIST_DATA_SOURCE} from './util/feature-folder/route-list/data-source/example/route-list/route-list-data-source-injection-token';
import {RouteListDataSourceInterface} from './util/feature-folder/route-list/data-source/route-list-data-source-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent<RouteDataType> {
  constructor(
    @Inject(ROUTE_LIST_DATA_SOURCE) public routeListDataSource: RouteListDataSourceInterface<RouteDataType>,
  ) {
  }
}
