import {RouteListDataSourceInterface} from '../../route-list-data-source-interface';
import {RouteData} from './route-data';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {distinctUntilChanged, map, take, tap} from 'rxjs/operators';
import {computeLevenshteinDistanceAmortized} from '../../../../../util-typescript/compute-levenshtein-distance/compute-levenshtein-distance-amortized';
import {LocalizationService} from '../../../../localization/localization/localization.service';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../../../../../src/app/config/api-url';
import {routeListUrlSuffix} from './route-list-url-suffix';
import {AuthService} from '../../../../auth/auth/auth.service';
import {getMergedComparatorFunc} from '../../../../../util-typescript/comparator/get-merged-comparator-func/get-merged-comparator-func';
import {getComparatorByFuncResult} from '../../../../../util-typescript/comparator/get-comparator-by-func-result/get-comparator-by-func-result';

export class RouteListDataSource implements RouteListDataSourceInterface<RouteData> {
  readonly dataObjectTreeRootListBS$ = new BehaviorSubject<Array<RouteData>>([]);

  private _currentUrlBS$ = new BehaviorSubject<string>(null);
  private _dataMatchingCurrentUrlSet = new Set<RouteData>();
  private _dataObjectToParentMapBS$ = new BehaviorSubject(new Map<RouteData, RouteData>());
  private _flatDataObjectListBS$ = new BehaviorSubject<Array<RouteData>>([]);
  private _routeListUrl = `${apiUrl}${routeListUrlSuffix}`;
  private _urlToDataObjectSetMapBS$ = new BehaviorSubject(new Map<string, Set<RouteData>>());

  constructor(
    private _authService: AuthService<any, any>,
    private _httpClient: HttpClient,
    private _localizationService: LocalizationService,
  ) {
    this._authService.authDataSource.isLoggedInContinuous$.subscribe(() => {
      this._loadRouteListDataSource().subscribe();
    });

    combineLatest([
      this._currentUrlBS$.pipe(distinctUntilChanged()),
      this._dataObjectToParentMapBS$,
      this._urlToDataObjectSetMapBS$,
    ]).subscribe(([currentUrl, dataObjectToParentMap, urlToDataObjectSetMap]) => {
      this._dataMatchingCurrentUrlSet = new Set<RouteData>();
      const urlToMatchingDataObjectSet = urlToDataObjectSetMap.get(currentUrl);
      if (urlToMatchingDataObjectSet) {
        for (let matchingDataObject of Array.from(urlToMatchingDataObjectSet)) {
          while (matchingDataObject) {
            this._dataMatchingCurrentUrlSet.add(matchingDataObject);
            matchingDataObject = dataObjectToParentMap.get(matchingDataObject);
          }
        }
      }
    });
  }

  public getChildList$(dataObject: RouteData): Observable<Array<RouteData>> {
    return of(dataObject.items || null);
  }

  public getDisplayTextContinuous$(dataObject: RouteData): Observable<string> {
    return this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(dataObject.localizationCode);
  }

  public getIconCode$(dataObject: RouteData): Observable<string> {
    return of(dataObject.iconCode ? 'folder' : null);
  }

  public getSearchResultList$(searchText: string): Observable<RouteData[]> {
    let flatListCopy = this._flatDataObjectListBS$.getValue().filter(dataObject => dataObject.url && dataObject.url !== '#');

    return combineLatest(
      flatListCopy.map(dataObject => {
        return this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(dataObject.localizationCode);
      }),
    ).pipe(
      // using take(1) instead of first(), because it produces error
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

          const firstSearchTextChar = searchTextLowerCased[0];
          flatListCopy.sort(getMergedComparatorFunc([
            // Sorting by index of full search text match
            getComparatorByFuncResult((dataObject) => {
              const matchIndex = dataObjectToLocalizedMessageMap.get(dataObject).toLowerCase().indexOf(searchTextLowerCased);
              if (matchIndex < 0) {
                return Infinity;
              } else {
                return matchIndex;
              }
            }),
            // Sorting by amortised levenshtein distance
            getComparatorByFuncResult((dataObject) => {
              return computeLevenshteinDistanceAmortized(
                searchTextLowerCased,
                dataObjectToLocalizedMessageMap.get(dataObject).toLowerCase(),
              );
            }),
            // Sorting by index of first symbol in search text
            getComparatorByFuncResult((dataObject) => {
              const matchIndex = dataObjectToLocalizedMessageMap.get(dataObject).toLowerCase().indexOf(firstSearchTextChar);
              if (matchIndex < 0) {
                return Infinity;
              } else {
                return matchIndex;
              }
            }),
            // Sorting by name
            getComparatorByFuncResult((dataObject) => {
              return dataObjectToLocalizedMessageMap.get(dataObject);
            }),
          ]));
        } else {
          // Sorting by name
          flatListCopy.sort(getComparatorByFuncResult((dataObject) => {
            return dataObjectToLocalizedMessageMap.get(dataObject);
          }));
        }

        return flatListCopy.slice(0, 50);
      }),
    );
  }

  public getUrl$(dataObject: RouteData): Observable<string> {
    return of((dataObject.url && dataObject.url !== '#') ? dataObject.url : null);
  }

  public hasChildList$(dataObject: RouteData): Observable<boolean> {
    return of(!!dataObject.items);
  }

  public matchesUrl$(dataObject: RouteData, url: string): Observable<boolean> {
    this._currentUrlBS$.next(url);
    return of(this._dataMatchingCurrentUrlSet.has(dataObject));
  }

  private _appendDataObjectToMaps(
    dataObject: RouteData,
    dataObjectToParentMap: Map<RouteData, RouteData>,
    urlToDataObjectSetMap: Map<string, Set<RouteData>>,
    flatDataObjectList: Array<RouteData>,
    parent: RouteData = null,
  ) {
    let dataObjectSet = urlToDataObjectSetMap.get(dataObject.url);
    if (dataObjectSet) {
      dataObjectSet.add(dataObject);
    } else {
      dataObjectSet = new Set<RouteData>([dataObject]);
      urlToDataObjectSetMap.set(dataObject.url, dataObjectSet);
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

  private _loadRouteListDataSource(): Observable<Array<RouteData>> {
    return this._authService.authDataSource.isLoggedInContinuous$.pipe(
      map(isLoggedIn => {
        return isLoggedIn ? this._generateList(3, 10) : this._generateList(2, 5);
      }),
      // return this._httpClient.post<Array<RouteData>>(this._routeListUrl, {code: 'main-menu-vertical'}).pipe(
      tap(dataObjectTree => {
        this.dataObjectTreeRootListBS$.next(dataObjectTree);

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

  private _generateList(
    levelCount: number,
    countPerLevel: number,
    currentLevelCount = 1,
    parent: RouteData = null,
  ): Array<RouteData> {
    const routeList: Array<RouteData> = [];

    for (const index of Array.from(Array(countPerLevel).keys())) {
      const route: RouteData = {
        iconCode: 'folder',
        localizationCode: `${parent ? `${parent.localizationCode}-` : ''}${index + 1}`,
        url: `${parent ? `${parent.url}-` : '/'}${index + 1}`,
      };
      if (currentLevelCount < levelCount) {
        route.items = this._generateList(levelCount, countPerLevel, currentLevelCount + 1, route);
      }
      routeList.push(route);
    }

    return routeList;
  }
}
