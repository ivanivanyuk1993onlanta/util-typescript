import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RouteData} from '../../class-folder/route/route-data';
import {StorageWrap} from '../../class-folder/storage/storage';
import {registerStorageObserver} from '../../class-folder/storage/register-storage-observer';

@Injectable({
  providedIn: 'root',
})
// @ts-ignore
export class AuthService implements RegisterFieldObserversMixin {
  public isRouteDataListLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isSignedInSubject$ = new BehaviorSubject<boolean>(false);
  public routeDataListSubject$ = new BehaviorSubject<Array<RouteData>>([]);
  public userNameSubject$ = new BehaviorSubject<string>('');

  // private _routeDataListUrl = `${environment.apiUrl}/route`;
  private _routeDataListUrl = 'https://api.myjson.com/bins/iyjf6'; // todo: remove debug code
  private _storage = new StorageWrap('auth');

  constructor(
    private _httpClient: HttpClient,
  ) {
    registerStorageObserver(
      this._storage,
      this.isSignedInSubject$,
      'isSignedIn'
    );

    registerStorageObserver(
      this._storage,
      this.routeDataListSubject$,
      'routeDataList'
    ).then(() => {
      this._loadRouteDataList();
    });

    registerStorageObserver(
      this._storage,
      this.userNameSubject$,
      'userName'
    );
  }

  public signIn() {
    this.isSignedInSubject$.next(true);
    this._loadRouteDataList();
    this.userNameSubject$.next('ivanivanyuk1993');
  }

  public signOut() {
    this.isSignedInSubject$.next(false);
    // this._loadRouteDataList();
    this._simulateLoadEmptyPermittedRouteDataList();
    this.userNameSubject$.next('');
  }

  private _loadRouteDataList(): void {
    this.isRouteDataListLoadingSubject$.next(true);
    this._httpClient.
      // get<RouteData[]>(this._routeDataListUrl, {withCredentials: true}).
      get<RouteData[]>(this._routeDataListUrl). // todo: remove debug code
      subscribe((routeDataList: RouteData[]) => {
        this.routeDataListSubject$.next(routeDataList);
        this.isRouteDataListLoadingSubject$.next(false);
      });
  }

  private _simulateLoadEmptyPermittedRouteDataList() {
    this.isRouteDataListLoadingSubject$.next(true);
    setTimeout(() => {
      this.routeDataListSubject$.next([]);
      this.isRouteDataListLoadingSubject$.next(false);
    }, 500);
  }
}
