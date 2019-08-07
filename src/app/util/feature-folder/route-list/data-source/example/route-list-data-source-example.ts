import {RouteListDataSourceInterface} from '../route-list-data-source-interface';
import {RouteExampleInterface} from './route-example-interface';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {tap} from 'rxjs/operators';

export class RouteListDataSourceExample implements RouteListDataSourceInterface<RouteExampleInterface> {
  readonly dataObjectTreeBS$ = new BehaviorSubject<Array<RouteExampleInterface>>([]);
  readonly filteredDataObjectListBS$: BehaviorSubject<Array<RouteExampleInterface>>;
  readonly filteredDataObjectTreeBS$: BehaviorSubject<Array<RouteExampleInterface>>;

  applySearch(searchString: string): Observable<void> {
    return undefined;
  }

  connect(collectionViewer: CollectionViewer): Observable<RouteExampleInterface[]> {
    return of(this._generateList(3, 3)).pipe(
      tap(dataObjectTree => {
        this.dataObjectTreeBS$.next(dataObjectTree);
      }),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  getChildren(dataObject: RouteExampleInterface): Observable<Array<RouteExampleInterface>> {
    return of(dataObject.children || null);
  }

  getDisplayTextBS$(dataObject: RouteExampleInterface): BehaviorSubject<string> {
    return new BehaviorSubject<string>(dataObject.localizationCode);
  }

  getUrl(dataObject: RouteExampleInterface): Observable<string> {
    return undefined;
  }

  private _generateList(
    levelCount: number,
    countPerLevel: number,
    currentLevelCount = 1,
    parent: RouteExampleInterface = null,
  ): Array<RouteExampleInterface> {
    const routeList: Array<RouteExampleInterface> = [];

    const shouldGenerateChildren = currentLevelCount < levelCount;
    const nextLevelCount = currentLevelCount + 1;

    for (const index of Array.from(Array(countPerLevel).keys())) {
      const route: RouteExampleInterface = {
        localizationCode: `${parent ? `${parent.localizationCode}-` : ''}${index + 1}`,
        url: `${parent ? `${parent.url}-` : ''}${index + 1}`,
      };
      if (shouldGenerateChildren) {
        route.children = this._generateList(levelCount, countPerLevel, nextLevelCount, route);
      }
      routeList.push(route);
    }

    return routeList;
  }
}
