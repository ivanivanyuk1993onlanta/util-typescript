import {applyMixins} from 'rxjs/internal-compatibility';
import {environment} from '../../../../environments/environment';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {RouteData} from '../../class/route/route-data';
import {StorageWrap} from '../../class/storage/storage';
import { registerStorageObserver } from '../../class/storage/register-storage-observer';

@Injectable({
  providedIn: 'root',
})
// @ts-ignore
export class AuthService implements RegisterFieldObserversMixin {
  public isSignedInSubject$ = new BehaviorSubject<boolean>(false);
  public routeDataListSubject$ = new BehaviorSubject<Array<RouteData>>([]);
  public userNameSubject$ = new BehaviorSubject<string>('');

  // private _routeDataListUrl = `${environment.apiUrl}/route`;
  private _routeDataListUrl = 'https://api.myjson.com/bins/iu6sa'; // todo: remove debug code
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
    this.routeDataListSubject$.next([]);
    this.userNameSubject$.next('');
  }

  private _loadRouteDataList(): void {
    this._httpClient.
      // get<RouteData[]>(this._routeDataListUrl, {withCredentials: true}).
      get<RouteData[]>(this._routeDataListUrl). // todo: remove debug code
      subscribe((routeDataList: RouteData[]) => {
        this.routeDataListSubject$.next(routeDataList);
      });
  }
}
