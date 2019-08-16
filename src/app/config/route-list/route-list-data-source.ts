import {RouteListDataSourceInterface} from '../../util/feature-folder/route-list/data-source/route-list-data-source-interface';
import {RouteData} from './route-data';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {map, take, tap} from 'rxjs/operators';
import {computeLevenshteinDistanceAmortized} from '../../util/method-folder/compute-levenshtein-distance/compute-levenshtein-distance-amortized';
import {sortByFuncResult} from '../../util/method-folder/sort-by-func-result/sort-by-func-result';
import {LocalizationService} from '../../util/feature-folder/localization/localization/localization.service';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../api-url';
import {routeListUrlSuffix} from './route-list-url-suffix';

export class RouteListDataSource implements RouteListDataSourceInterface<RouteData> {
  readonly dataObjectTreeBS$ = new BehaviorSubject<Array<RouteData>>([]);

  private _currentUrl: string = null;
  private _dataMatchingCurrentUrlSet = new Set<RouteData>();
  private _dataObjectToParentMapBS$ = new BehaviorSubject(new Map<RouteData, RouteData>());
  private _flatDataObjectListBS$ = new BehaviorSubject<Array<RouteData>>([]);
  private _routeListUrl = `${apiUrl}${routeListUrlSuffix}`;
  private _urlToDataObjectSetMapBS$ = new BehaviorSubject(new Map<string, Set<RouteData>>());

  constructor(
    private _httpClient: HttpClient,
    private _localizationService: LocalizationService,
  ) {
  }

  public connect(collectionViewer: CollectionViewer): Observable<RouteData[]> {
    return this._httpClient.post<Array<RouteData>>(this._routeListUrl, {code: 'main-menu-vertical'}).pipe(
      map(menuRoot => (menuRoot as any).items),
      tap(dataObjectTree => {
        this.dataObjectTreeBS$.next(dataObjectTree);

        const dataObjectToParentMap = new Map<RouteData, RouteData>();
        const flatDataObjectList: Array<RouteData> = [];
        const urlToDataObjectSetMap = new Map<string, Set<RouteData>>();
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

  public getChildList$(dataObject: RouteData): Observable<Array<RouteData>> {
    return of(dataObject.items || null);
  }

  public getDisplayTextContinuous$(dataObject: RouteData): Observable<string> {
    return of(dataObject.text);
    // return this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(dataObject.text);
  }

  public getIconCode$(dataObject: RouteData): Observable<string> {
    return of(dataObject.imageUrl ? 'folder' : null);
  }

  getSearchResultList$(searchText: string): Observable<RouteData[]> {
    let flatListCopy = this._flatDataObjectListBS$.getValue().filter(dataObject => dataObject.action && dataObject.action !== '#');

    return combineLatest(
      flatListCopy.map(dataObject => {
        return this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(dataObject.text);
      }),
    ).pipe(
      take(1),
      map(localizedMessageList => {
        const dataObjectToLocalizedMessageMap = new Map<RouteData, string>(flatListCopy.map((dataObject, index) => {
          return [
            dataObject,
            localizedMessageList[index]
          ];
        }));
        if (searchText) {
          const searchTextLowerCased = searchText.toLowerCase();

          flatListCopy = flatListCopy.filter(dataObject => {
            return computeLevenshteinDistanceAmortized(
              searchTextLowerCased,
              dataObjectToLocalizedMessageMap.get(dataObject).toLowerCase(),
            ) < 1;
          });

          // Sorting by name
          sortByFuncResult(flatListCopy, (dataObject) => {
            return dataObjectToLocalizedMessageMap.get(dataObject);
          });

          // Sorting by index of first symbol in search text
          const firstSearchTextChar = searchTextLowerCased[0];
          sortByFuncResult(flatListCopy, (dataObject) => {
            const matchIndex = dataObjectToLocalizedMessageMap.get(dataObject).toLowerCase().indexOf(firstSearchTextChar);
            if (matchIndex < 0) {
              return Infinity;
            } else {
              return matchIndex;
            }
          });

          // Sorting by amortised levenshtein distance
          sortByFuncResult(flatListCopy, (dataObject) => {
            return computeLevenshteinDistanceAmortized(searchTextLowerCased, dataObjectToLocalizedMessageMap.get(dataObject).toLowerCase());
          });

          // Sorting by index of full search text match
          sortByFuncResult(flatListCopy, (dataObject) => {
            const matchIndex = dataObjectToLocalizedMessageMap.get(dataObject).toLowerCase().indexOf(searchTextLowerCased);
            if (matchIndex < 0) {
              return Infinity;
            } else {
              return matchIndex;
            }
          });
        } else {
          // Sorting by name
          sortByFuncResult(flatListCopy, (dataObject) => {
            return dataObjectToLocalizedMessageMap.get(dataObject);
          });
        }

        return flatListCopy.slice(0, 50);
      }),
    );
  }

  public getUrl$(dataObject: RouteData): Observable<string> {
    return of((dataObject.action && dataObject.action !== '#') ? dataObject.action : null);
  }

  public matchesUrl$(dataObject: RouteData, url: string): Observable<boolean> {
    if (url !== this._currentUrl) {
      this._currentUrl = url;
      const dataObjectToParentMap = this._dataObjectToParentMapBS$.getValue();
      this._dataMatchingCurrentUrlSet = new Set<RouteData>();
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
    dataObject: RouteData,
    dataObjectToParentMap: Map<RouteData, RouteData>,
    urlToDataObjectSetMap: Map<string, Set<RouteData>>,
    flatDataObjectList: Array<RouteData>,
    parent: RouteData = null,
  ) {
    let dataObjectSet = urlToDataObjectSetMap.get(dataObject.action);
    if (dataObjectSet) {
      dataObjectSet.add(dataObject);
    } else {
      dataObjectSet = new Set<RouteData>([dataObject]);
      urlToDataObjectSetMap.set(dataObject.action, dataObjectSet);
    }

    if (parent) {
      dataObjectToParentMap.set(dataObject, parent);
    }

    flatDataObjectList.push(dataObject);

    const childList = dataObject.items;
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

  // Do not delete this debug example
  // private _generateList(
  //   levelCount: number,
  //   countPerLevel: number,
  //   currentLevelCount = 1,
  //   parent: RouteData = null,
  // ): Array<RouteData> {
  //   const routeList: Array<RouteData> = [];
  //
  //   for (const index of Array.from(Array(countPerLevel).keys())) {
  //     const route: RouteData = {
  //       localizationCode: `${parent ? `${parent.localizationCode}-` : ''}${index + 1}`,
  //       url: `${parent ? `${parent.url}-` : '/'}${index + 1}`,
  //     };
  //     if (currentLevelCount < levelCount) {
  //       route.children = this._generateList(levelCount, countPerLevel, currentLevelCount + 1, route);
  //     }
  //     routeList.push(route);
  //   }
  //
  //   return routeList;
  // }
}
