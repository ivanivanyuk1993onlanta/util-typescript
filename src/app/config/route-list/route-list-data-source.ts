import {RouteListDataSourceInterface} from '../../util/feature-folder/route-list/data-source/route-list-data-source-interface';
import {RouteData} from './route-data';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {tap} from 'rxjs/operators';
import {computeLevenshteinDistanceAmortized} from '../../util/method-folder/compute-levenshtein-distance/compute-levenshtein-distance-amortized';
import {sortByFuncResult} from '../../util/method-folder/sort-by-func-result/sort-by-func-result';
import {LocalizationService} from '../../util/feature-folder/localization/localization/localization.service';

export class RouteListDataSource implements RouteListDataSourceInterface<RouteData> {
  readonly dataObjectTreeBS$ = new BehaviorSubject<Array<RouteData>>([]);

  private _currentUrl: string = null;
  private _dataMatchingCurrentUrlSet = new Set<RouteData>();
  private _dataObjectToParentMapBS$ = new BehaviorSubject(new Map<RouteData, RouteData>());
  private _flatDataObjectListBS$ = new BehaviorSubject<Array<RouteData>>([]);
  private _urlToDataObjectSetMapBS$ = new BehaviorSubject(new Map<string, Set<RouteData>>());

  constructor(
    private _localizationService: LocalizationService,
  ) {
  }

  public connect(collectionViewer: CollectionViewer): Observable<RouteData[]> {
    return of(this._generateList(3, 10)).pipe(
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
    return of(dataObject.children || null);
  }

  public getDisplayTextContinuous$(dataObject: RouteData): Observable<string> {
    return this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(dataObject.localizationCode);
  }

  getSearchResultList$(searchText: string): Observable<RouteData[]> {
    const flatListCopy = [...this._flatDataObjectListBS$.getValue()];

    // if (searchText) {
    //   const searchTextLowerCased = searchText.toLowerCase();
    //
    //   flatListCopy = flatListCopy.filter(dataObject => {
    //     return computeLevenshteinDistanceAmortized(
    //       searchTextLowerCased,
    //       this.getDisplayTextContinuous$(dataObject).getValue().toLowerCase(),
    //     ) < 1;
    //   });
    //
    //   // Sorting by name
    //   sortByFuncResult(flatListCopy, (dataObject) => {
    //     return this.getDisplayTextContinuous$(dataObject).getValue();
    //   });
    //
    //   // Sorting by index of first symbol in search text
    //   const firstSearchTextChar = searchTextLowerCased[0];
    //   sortByFuncResult(flatListCopy, (dataObject) => {
    //     const matchIndex = this.getDisplayTextContinuous$(dataObject).getValue().toLowerCase().indexOf(firstSearchTextChar);
    //     if (matchIndex < 0) {
    //       return Infinity;
    //     } else {
    //       return matchIndex;
    //     }
    //   });
    //
    //   // Sorting by amortised levenshtein distance
    //   sortByFuncResult(flatListCopy, (dataObject) => {
    //     return computeLevenshteinDistanceAmortized(searchTextLowerCased, this.getDisplayTextContinuous$(dataObject).getValue().toLowerCase());
    //   });
    //
    //   // Sorting by index of full search text match
    //   sortByFuncResult(flatListCopy, (dataObject) => {
    //     const matchIndex = this.getDisplayTextContinuous$(dataObject).getValue().toLowerCase().indexOf(searchTextLowerCased);
    //     if (matchIndex < 0) {
    //       return Infinity;
    //     } else {
    //       return matchIndex;
    //     }
    //   });
    // } else {
    //   // Sorting by name
    //   sortByFuncResult(flatListCopy, (dataObject) => {
    //     return this.getDisplayTextContinuous$(dataObject).getValue();
    //   });
    // }
    return of(flatListCopy.slice(0, 50));
  }

  public getUrl$(dataObject: RouteData): Observable<string> {
    return of(dataObject.url || null);
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
    parent: RouteData = null,
  ): Array<RouteData> {
    const routeList: Array<RouteData> = [];

    for (const index of Array.from(Array(countPerLevel).keys())) {
      const route: RouteData = {
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
