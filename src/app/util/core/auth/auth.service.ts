import {environment} from '../../../../environments/environment';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RouteData} from '../route/route-data';
import {StorageWrap} from '../storage/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isSignedInFormControl = new FormControl(false);
  private _routeDataListFormControl = new FormControl(new Array<RouteData>());
  private _routeDataListUrl = `${environment.apiUrl}/route`;
  private _storage: StorageWrap;
  private _userNameFormControl = new FormControl('');

  readonly isSignedIn$: Observable<boolean>;
  readonly routeDataList$: Observable<RouteData[]>;
  readonly userName$: Observable<string>;

  constructor(
    private _httpClient: HttpClient,
  ) {
    this._storage = new StorageWrap('auth');

    this.registerFieldObservers<boolean>(
      'isSignedIn',
      () => Promise.resolve(false),
    );
    this.registerFieldObservers<RouteData[]>(
      'routeDataList',
      this.loadRouteDataList.bind(this),
    );
    this.registerFieldObservers<string>(
      'userName',
      () => Promise.resolve(''),
    );
  }

  private loadRouteDataList(): Promise<RouteData[]> {
    return this._httpClient.
      get<RouteData[]>(this._routeDataListUrl, {withCredentials: true}).
      toPromise<RouteData[]>().
      then((routeDataList: RouteData[]) => {
        return routeDataList;
      }).
      catch(() => {
        return [];
      });
  }

  private registerFieldObservers<T>(
    fieldName: string,
    getValueDefaultFunc: () => Promise<T>,
  ): void {
    const fieldNameFormControl = `_${fieldName}FormControl`;
    const fieldNameObservable = `${fieldName}$`;

    this[fieldNameObservable] = this[fieldNameFormControl].valueChanges.pipe(
      startWith(this[fieldNameFormControl].value),
      map((value) => {
        return value;
      }),
    );

    this[fieldNameFormControl].valueChanges.subscribe(
      (value: T) => {
        this._storage.set<T>(fieldName, value);
      },
    );

    this._storage.get<T>(fieldName).
      then((valueStored: T) => {
        if (valueStored !== null) {
          this[fieldNameFormControl].setValue(valueStored);
        } else {
          getValueDefaultFunc().then(
            (value: T) => {
              this[fieldNameFormControl].setValue(value);
            },
          );
        }
      }).
      catch(() => {
        getValueDefaultFunc().
          then((value: T) => {
            this[fieldNameFormControl].setValue(value);
          });
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
}
