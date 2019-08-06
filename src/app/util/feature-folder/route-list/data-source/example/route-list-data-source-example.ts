import {RouteListDataSourceInterface} from '../route-list-data-source-interface';
import {RouteExampleInterface} from './route-example-interface';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

export class RouteListDataSourceExample implements RouteListDataSourceInterface<RouteExampleInterface> {
  readonly dataObjectTreeBS$: BehaviorSubject<Array<RouteExampleInterface>>;
  readonly filteredDataObjectListBS$: BehaviorSubject<Array<RouteExampleInterface>>;
  readonly filteredDataObjectTreeBS$: BehaviorSubject<Array<RouteExampleInterface>>;

  applySearch(searchString: string): Observable<void> {
    return undefined;
  }

  connect(collectionViewer: CollectionViewer): Observable<RouteExampleInterface[]> {
    return of(this._generateList(3, 3));
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  getChildren(dataObject: RouteExampleInterface): Observable<Array<RouteExampleInterface>> {
    return undefined;
  }

  getDisplayText(dataObject: RouteExampleInterface): BehaviorSubject<string> {
    return undefined;
  }

  getUrl(dataObject: RouteExampleInterface): Observable<string> {
    return undefined;
  }

  private _generateList(
    levelCount: number,
    countPerLevel: number,
    currentLevelCount = 0,
    parent: RouteExampleInterface = null,
  ): Array<RouteExampleInterface> {
    const routeList: Array<RouteExampleInterface> = [];

    for (const index of Array.from(Array(countPerLevel).keys())) {
      const route: RouteExampleInterface = {
        localizationCode: `${parent ? `${parent.localizationCode}-` : ''}${index + 1}`,
        url: `${parent ? `${parent.url}-` : ''}${index + 1}`,
      };
      if (currentLevelCount < levelCount) {
        route.children = this._generateList(levelCount, countPerLevel, currentLevelCount + 1, route);
      }
      routeList.push(route);
    }

    if (currentLevelCount === 0) {
      console.log(routeList);
    }

    return routeList;
  }
}
