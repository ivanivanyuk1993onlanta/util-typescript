import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RouteData} from '../route/route-data';
import {StorageWrap} from '../storage/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isLoggedIn$: Observable<boolean>;
  readonly routeDataList = new FormControl([]);
  readonly routeDataListUrl = 'http://localhost:8080/route';
  readonly storage: StorageWrap;
  readonly userName = new FormControl('');

  constructor(
    private httpClient: HttpClient,
  ) {
    this.storage = new StorageWrap('auth');

    this.isLoggedIn$ = this.userName.valueChanges.pipe(
      map((userName: string): boolean => {
        return userName !== '';
      }),
    );

    this.registerFieldObservers<RouteData[]>(
      'routeDataList',
      this.loadRouteDataList,
    );
    this.registerFieldObservers<string>(
      'userName',
      () => Promise.resolve(''),
    );
  }

  private loadRouteDataList(): Promise<RouteData[]> {
    return this.httpClient.
      get<RouteData[]>(this.routeDataListUrl).
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
    this[fieldName].valueChanges.subscribe(
      (value: T) => {
        this.storage.set<T>(fieldName, value);
      },
    );

    this.storage.get<T>(fieldName).
      then((valueStored: T) => {
        if (valueStored !== null) {
          this[fieldName].setValue(valueStored);
        } else {
          getValueDefaultFunc().then(
            (value: T) => {
              this[fieldName].setValue(value);
            },
          );
        }
      }).
      catch(() => {
        this[fieldName].setValue(getValueDefaultFunc());
      });
  }

  signIn() {
    this.userName.setValue('ivanivanyuk1993');
  }

  signOut() {
    this.userName.setValue('');
  }
}
