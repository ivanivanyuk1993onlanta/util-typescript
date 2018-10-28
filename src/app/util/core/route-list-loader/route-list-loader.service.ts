import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RouteData} from './route-data';

@Injectable({
  providedIn: 'root',
})
export class RouteListLoaderService {
  private routeListUrl = 'https://api.myjson.com/bins/19723u';

  constructor(
    private http: HttpClient,
  ) {
  }

  load(): Observable<RouteData[]> {
    return this.http.get<RouteData[]>(this.routeListUrl);
  }
}
