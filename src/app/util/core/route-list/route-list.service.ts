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

  load(): Observable<RouteData[]> {
    return this.httpClient.get<RouteData[]>(this.routeListUrl);
  }
}
