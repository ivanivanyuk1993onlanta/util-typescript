import {RouteListDataSourceInterface} from '../route-list-data-source-interface';
import {RouteExampleInterface} from './route-example-interface';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {tap} from 'rxjs/operators';
import {computeLevenshteinDistanceAmortized} from '../../../../method-folder/compute-levenshtein-distance/compute-levenshtein-distance-amortized';
import {sortByFuncResult} from '../../../../method-folder/sort-by-func-result/sort-by-func-result';

export class RouteListDataSourceExample implements RouteListDataSourceInterface<RouteExampleInterface> {
  readonly dataObjectTreeBS$ = new BehaviorSubject<Array<RouteExampleInterface>>([]);

  private _currentUrl: string = null;
  private _dataMatchingCurrentUrlSet = new Set<RouteExampleInterface>();
  private _dataObjectToParentMapBS$ = new BehaviorSubject(new Map<RouteExampleInterface, RouteExampleInterface>());
  private _flatDataObjectListBS$ = new BehaviorSubject<Array<RouteExampleInterface>>([]);
  private _urlToDataObjectSetMapBS$ = new BehaviorSubject(new Map<string, Set<RouteExampleInterface>>());

  public connect(collectionViewer: CollectionViewer): Observable<RouteExampleInterface[]> {
    return of(this._generateList(3, 10)).pipe(
      tap(dataObjectTree => {
        this.dataObjectTreeBS$.next(dataObjectTree);

        const dataObjectToParentMap = new Map<RouteExampleInterface, RouteExampleInterface>();
        const flatDataObjectList: Array<RouteExampleInterface> = [];
        const urlToDataObjectSetMap = new Map<string, Set<RouteExampleInterface>>();
        for (const dataObject of dataObjectTree) {
          this._appendDataObjectToMaps(
            dataObject,
            dataObjectToParentMap,
            urlToDataObjectSetMap,
            flatDataObjectList,
          );
        }
        this._dataObjectToParentMapBS$.next(dataObjectToParentMap);
        this._flatDataObjectListBS$.next(flatDataObjectList);
        this._urlToDataObjectSetMapBS$.next(urlToDataObjectSetMap);
      }),
    );
  }

  public disconnect(collectionViewer: CollectionViewer): void {
  }

  public getChildList$(dataObject: RouteExampleInterface): Observable<Array<RouteExampleInterface>> {
    return of(dataObject.children || null);
  }

  public getDisplayTextBS$(dataObject: RouteExampleInterface): BehaviorSubject<string> {
    return new BehaviorSubject<string>(dataObject.localizationCode);
  }

  getSearchResultList$(searchText: string): Observable<RouteExampleInterface[]> {
    let flatListCopy = [...this._flatDataObjectListBS$.getValue()];

    if (searchText) {
      const searchTextLowerCased = searchText.toLowerCase();

      flatListCopy = flatListCopy.filter(dataObject => {
        return computeLevenshteinDistanceAmortized(
          searchTextLowerCased,
          this.getDisplayTextBS$(dataObject).getValue().toLowerCase(),
        ) < 1;
      });

      // Sorting by name
      sortByFuncResult(flatListCopy, (dataObject) => {
        return this.getDisplayTextBS$(dataObject).getValue();
      });

      // Sorting by index of first symbol in search text
      const firstSearchTextChar = searchTextLowerCased[0];
      sortByFuncResult(flatListCopy, (dataObject) => {
        const matchIndex = this.getDisplayTextBS$(dataObject).getValue().toLowerCase().indexOf(firstSearchTextChar);
        if (matchIndex < 0) {
          return Infinity;
        } else {
          return matchIndex;
        }
      });

      // Sorting by amortised levenshtein distance
      sortByFuncResult(flatListCopy, (dataObject) => {
        return computeLevenshteinDistanceAmortized(searchTextLowerCased, this.getDisplayTextBS$(dataObject).getValue().toLowerCase());
      });

      // Sorting by index of full search text match
      sortByFuncResult(flatListCopy, (dataObject) => {
        const matchIndex = this.getDisplayTextBS$(dataObject).getValue().toLowerCase().indexOf(searchTextLowerCased);
        if (matchIndex < 0) {
          return Infinity;
        } else {
          return matchIndex;
        }
      });
    } else {
      // Sorting by name
      sortByFuncResult(flatListCopy, (dataObject) => {
        return this.getDisplayTextBS$(dataObject).getValue();
      });
    }
    return of(flatListCopy.slice(0, 50));
  }

  public getUrl$(dataObject: RouteExampleInterface): Observable<string> {
    return of(dataObject.url || null);
  }

  public matchesUrl$(dataObject: RouteExampleInterface, url: string): Observable<boolean> {
    if (url !== this._currentUrl) {
      this._currentUrl = url;
      const dataObjectToParentMap = this._dataObjectToParentMapBS$.getValue();
      this._dataMatchingCurrentUrlSet = new Set<RouteExampleInterface>();
      const urlToDataObjectSetMap = this._urlToDataObjectSetMapBS$.getValue();
      const urlToMatchingDataObjectSet = urlToDataObjectSetMap.get(url);
      if (urlToMatchingDataObjectSet) {
        for (let matchingDataObject of Array.from(urlToMatchingDataObjectSet)) {
          while (matchingDataObject) {
            this._dataMatchingCurrentUrlSet.add(matchingDataObject);

            matchingDataObject = dataObjectToParentMap.get(matchingDataObject);
          }
        }
      }
    }
    return of(this._dataMatchingCurrentUrlSet.has(dataObject));
  }

  private _appendDataObjectToMaps(
    dataObject: RouteExampleInterface,
    dataObjectToParentMap: Map<RouteExampleInterface, RouteExampleInterface>,
    urlToDataObjectSetMap: Map<string, Set<RouteExampleInterface>>,
    flatDataObjectList: Array<RouteExampleInterface>,
    parent: RouteExampleInterface = null,
  ) {
    let dataObjectSet = urlToDataObjectSetMap.get(dataObject.url);
    if (dataObjectSet) {
      dataObjectSet.add(dataObject);
    } else {
      dataObjectSet = new Set<RouteExampleInterface>([dataObject]);
      urlToDataObjectSetMap.set(dataObject.url, dataObjectSet);
    }

    if (parent) {
      dataObjectToParentMap.set(dataObject, parent);
    }

    flatDataObjectList.push(dataObject);

    const childList = dataObject.children;
    if (childList) {
      for (const child of childList) {
        this._appendDataObjectToMaps(
          child,
          dataObjectToParentMap,
          urlToDataObjectSetMap,
          flatDataObjectList,
          dataObject,
        );
      }
    }
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
