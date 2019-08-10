import {AuthDataSourceInterface} from '../../feature-folder/auth/data-source/auth-data-source-interface';
import {CredentialsInterface} from './credentials-interface';
import {AuthInterface} from './auth-interface';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {FieldDataInterface} from '../../feature-folder/auth/data-source/field-data-interface';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {apiUrl} from '../../services/rest-client-service/api-url';
import {loginUrlSuffix} from './login-url-suffix';
import {catchError, filter, first, map, mergeMap, retry, tap} from 'rxjs/operators';
import * as localForage from 'localforage';
import {logoutUrlSuffix} from './logout-url-suffix';
import notify from 'devextreme/ui/notify';

export class AuthDataSource implements AuthDataSourceInterface<CredentialsInterface, AuthInterface> {
  private static _authDBKey = 'auth';

  readonly displayTextBS$ = new BehaviorSubject<string>(null);
  readonly error401S$ = new Subject<HttpErrorResponse>();

  private _authBS$WrapBS$ = new BehaviorSubject<BehaviorSubject<AuthInterface>>(null);
  private _localForage = localForage.createInstance({
    name: AuthDataSource.constructor.name,
  });

  constructor(
    private _httpClient: HttpClient,
  ) {
    this._localForage.getItem<AuthInterface>(AuthDataSource._authDBKey).then((auth) => {
      const authBS$ = new BehaviorSubject(auth);
      authBS$.subscribe(auth2 => {
        if (auth2) {
          this._localForage.setItem<AuthInterface>(AuthDataSource._authDBKey, auth2);
          this.displayTextBS$.next(auth2.login);
        } else {
          this._localForage.removeItem(AuthDataSource._authDBKey);
          this.displayTextBS$.next(null);
        }
      });
      this._authBS$WrapBS$.next(authBS$);
    });
  }

  public getAuthContinuous$(): Observable<AuthInterface> {
    return this._waitForAuthBS$().pipe(
      mergeMap(authBS$ => authBS$),
    );
  }

  public getEmptyCredentialsFormGroup$(): Observable<FormGroup> {
    return of(
      new FormGroup({
        login: new FormControl(),
        password: new FormControl(),
      })
    );
  }

  public getLoginFormFieldDataList$(): Observable<Array<FieldDataInterface>> {
    return of([
      {
        fieldName: 'login',
        label: 'Логин',
      },
      {
        fieldName: 'password',
        label: 'Пароль',
        type: 'password',
      },
    ]);
  }

  public interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.getAuthContinuous$().pipe(
      first(),
      mergeMap(auth => {
        return next.handle(
          auth
            ? req.clone({
              setHeaders: {
                Authorization: `Bearer ${auth.jwtToken}`,
              },
            })
            : req
        );
      }),
      catchError((error: HttpErrorResponse, caught) => {
        if (error.status === 401 && req.url !== this._getLoginUrl()) {
          return this._setAuth$(null).pipe(
            tap(() => {
              this.error401S$.next();
              notify(error.message, 'error');
            }),
            mergeMap(() => this.getAuthContinuous$()),
            filter(x => !!x),
            first(),
            mergeMap(() => caught),
          );
        } else {
          return throwError(error);
        }
      }),
    );
  }

  public login$(credentials: CredentialsInterface): Observable<AuthInterface> {
    return this._httpClient.post(this._getLoginUrl(), credentials, {
      responseType: 'text',
    }).pipe(
      tap(
        () => {},
        error => {
          notify(error.message, 'error');
        }
      ),
      map((jwtToken) => {
        return {
          jwtToken,
          login: credentials.login,
        } as AuthInterface;
      }),
      mergeMap(auth => this._setAuth$(auth)),
    );
  }

  public logout$(): Observable<AuthInterface> {
    return this._httpClient.post(`${apiUrl}${logoutUrlSuffix}`, {}).pipe(
      mergeMap(() => this._setAuth$(null)),
    );
  }

  private _getLoginUrl(): string {
    return `${apiUrl}${loginUrlSuffix}`;
  }

  private _setAuth$(auth: AuthInterface): Observable<AuthInterface> {
    return this._waitForAuthBS$().pipe(
      tap(authBS$ => {
        authBS$.next(auth);
      }),
      mergeMap(authBS$ => authBS$),
      first(),
    );
  }

  private _waitForAuthBS$(): Observable<BehaviorSubject<AuthInterface>> {
    return this._authBS$WrapBS$.pipe(
      filter(x => !!x),
    );
  }
}
