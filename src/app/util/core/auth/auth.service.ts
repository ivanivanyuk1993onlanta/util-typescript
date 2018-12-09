import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
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
    this.isLoggedIn$ = this.userName.valueChanges.pipe(
      map((userName: string): boolean => {
        return userName !== '';
      }),
    );

    this.registerRouteListObservers();
    this.registerUserNameObservers();
  }

  private registerRouteListObservers() {
    const storageRecordName = 'routeDataList';
    const defaultValue = [];

    this.routeDataList.valueChanges.subscribe(
      (routeDataList: RouteData[]): void => {
        this.storage.set<RouteData[]>(storageRecordName, routeDataList);
      },
    );

    this.storage.get<RouteData[]>(storageRecordName).
      then((routeDataListStored: RouteData[]): void => {
        if (routeDataListStored !== null) {
          this.routeDataList.setValue(routeDataListStored);
        } else {
          this.httpClient.
            get<RouteData[]>(this.routeDataListUrl).
            toPromise<RouteData[]>().
            then((routeDataList: RouteData[]) => {
              this.routeDataList.setValue(routeDataList);
            }).
            catch(() => {
              this.routeDataList.setValue(defaultValue);
            });
        }
      }).
      catch(() => {
        this.routeDataList.setValue(defaultValue);
      });
  }

  private registerUserNameObservers() {
    const storageRecordName = 'userName';
    const defaultValue = '';

    this.userName.valueChanges.subscribe(
      (userName: string): void => {
        this.storage.set<string>(storageRecordName, userName);
      },
    );

    this.storage.get<string>(storageRecordName).
      then((userName: string): void => {
        if (userName !== null) {
          this.userName.setValue(userName);
        } else {
          this.userName.setValue(defaultValue);
        }
      }).
      catch(() => {
        this.userName.setValue(defaultValue);
      });
  }

  signIn() {
    this.userName.setValue('ivanivanyuk1993');
  }

  signOut() {
    this.userName.setValue('');
  }
}
