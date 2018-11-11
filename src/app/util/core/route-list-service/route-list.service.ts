import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RouteData} from './route-data';

@Injectable({
  providedIn: 'root',
})
export class RouteListService {
  private routeListUrl = 'https://api.myjson.com/bins/smnta';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  static addRouteDataToLangMap(
    routeData: RouteData,
    langMap: Object,
  ) {
    if ('langKey' in routeData) {
      langMap[routeData.langKey] = routeData.langKey + '_en';
    }

    if ('childRouteList' in routeData) {
      for (const routeDataListItem of routeData.childRouteList) {
        RouteListService.addRouteDataToLangMap(routeDataListItem, langMap);
      }
    }
  }

  static getLangMap(
    routeDataList: RouteData[],
  ): Object {
    const langMap: Object = {};

    langMap['other'] = 'other';

    for (const routeDataListItem of routeDataList) {
      RouteListService.addRouteDataToLangMap(routeDataListItem, langMap);
    }

    return langMap;
  }

  load(): Observable<RouteData[]> {
    return this.httpClient.get<RouteData[]>(this.routeListUrl);
  }
}
