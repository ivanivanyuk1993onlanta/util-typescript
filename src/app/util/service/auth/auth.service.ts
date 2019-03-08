import {applyMixins} from 'rxjs/internal-compatibility';
import {environment} from '../../../../environments/environment';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RegisterFieldObserversMixin} from '../../class/storage/register-field-observers-mixin';
import {RouteData} from '../../class/route/route-data';
import {StorageWrap} from '../../class/storage/storage';

@Injectable({
  providedIn: 'root',
})
// @ts-ignore
export class AuthService implements RegisterFieldObserversMixin {
  private _isSignedInFormControl = new FormControl(false);
  private _routeDataListFormControl = new FormControl(new Array<RouteData>());
  // private _routeDataListUrl = `${environment.apiUrl}/route`;
  private _routeDataListUrl = 'https://api.myjson.com/bins/iu6sa'; // todo: remove debug code
  private _storage: StorageWrap;
  private _userNameFormControl = new FormControl('');

  readonly isSignedIn$: Observable<boolean>;
  readonly routeDataList$: Observable<RouteData[]>;
  readonly userName$: Observable<string>;

  constructor(
    private _httpClient: HttpClient,
  ) {
    this._storage = new StorageWrap('auth');

    this._registerFieldObservers<boolean>(
      'isSignedIn',
      () => Promise.resolve(false),
    );
    this._registerFieldObservers<RouteData[]>(
      'routeDataList',
      this.loadRouteDataList.bind(this),
    );
    this._registerFieldObservers<string>(
      'userName',
      () => Promise.resolve(''),
    );
  }

  private loadRouteDataList(): Promise<RouteData[]> {
    return this._httpClient.
      // get<RouteData[]>(this._routeDataListUrl, {withCredentials: true}).
      get<RouteData[]>(this._routeDataListUrl). // todo: remove debug code
      toPromise<RouteData[]>().
      then((routeDataList: RouteData[]) => {
        return routeDataList;
      }).
      catch(() => {
        return this._routeDataListFormControl.value;
      });
  }

  signIn() {
    this._isSignedInFormControl.setValue(true);
    this.loadRouteDataList().then((routeDataList: RouteData[]) => {
      this._routeDataListFormControl.setValue(routeDataList);
    });
    this._userNameFormControl.setValue('ivanivanyuk1993');
  }

  signOut() {
    this._isSignedInFormControl.setValue(false);
    this.loadRouteDataList().then((routeDataList: RouteData[]) => {
      this._routeDataListFormControl.setValue(routeDataList);
    });
    this._userNameFormControl.setValue('');
  }

  private _registerFieldObservers<T>(
    fieldName: string,
    getValueDefaultFunc: () => Promise<T>,
  ): void {
  }
}

applyMixins(AuthService, [RegisterFieldObserversMixin]);
