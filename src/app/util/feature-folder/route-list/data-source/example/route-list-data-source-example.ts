import {RouteListDataSourceInterface} from '../route-list-data-source-interface';
import {RouteExampleInterface} from './route-example-interface';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {tap} from 'rxjs/operators';

export class RouteListDataSourceExample implements RouteListDataSourceInterface<RouteExampleInterface> {
  readonly dataObjectTreeBS$ = new BehaviorSubject<Array<RouteExampleInterface>>([]);
  readonly filteredDataObjectListBS$: BehaviorSubject<Array<RouteExampleInterface>>;
  readonly filteredDataObjectTreeBS$: BehaviorSubject<Array<RouteExampleInterface>>;

  public applySearch(searchString: string): Observable<void> {
    return undefined;
  }

  public connect(collectionViewer: CollectionViewer): Observable<RouteExampleInterface[]> {
    return of(this._generateList(3, 3)).pipe(
      tap(dataObjectTree => {
        this.dataObjectTreeBS$.next(dataObjectTree);
      }),
    );
  }

  public disconnect(collectionViewer: CollectionViewer): void {
  }

  public getChildList(dataObject: RouteExampleInterface): Observable<Array<RouteExampleInterface>> {
    return of(dataObject.children || null);
  }

  public getDisplayTextBS$(dataObject: RouteExampleInterface): BehaviorSubject<string> {
    return new BehaviorSubject<string>(dataObject.localizationCode);
  }

  public getUrl(dataObject: RouteExampleInterface): Observable<string> {
    return of(dataObject.url || null);
  }

  public matchesUrl(dataObject: RouteExampleInterface, url: string): Observable<boolean> {
    return of(dataObject.url === url);
  }

  private _generateList(
    levelCount: number,
    countPerLevel: number,
    currentLevelCount = 1,
    parent: RouteExampleInterface = null,
  ): Array<RouteExampleInterface> {
    const routeList: Array<RouteExampleInterface> = [];

    for (const index of Array.from(Array(countPerLevel).keys())) {
      const route: RouteExampleInterface = {
        localizationCode: `${parent ? `${parent.localizationCode}-` : ''}${index + 1}`,
        url: `${parent ? `${parent.url}-` : '/'}${index + 1}`,
      };
      if (currentLevelCount < levelCount) {
        route.children = this._generateList(levelCount, countPerLevel, currentLevelCount + 1, route);
      }
      routeList.push(route);
    }

    return routeList;
  }
}
