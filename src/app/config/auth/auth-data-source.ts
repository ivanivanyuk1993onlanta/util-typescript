import {AuthDataSourceInterface} from '../../util/feature-folder/auth/data-source/auth-data-source-interface';
import {CredentialsInterface} from './credentials-interface';
import {AuthInterface} from './auth-interface';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {catchError, filter, first, map, mergeMap, tap} from 'rxjs/operators';
import {apiUrl} from '../api-url';
import {logoutUrlSuffix} from './logout-url-suffix';
import {loginUrlSuffix} from './login-url-suffix';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import * as localForage from 'localforage';

export class AuthDataSource implements AuthDataSourceInterface<CredentialsInterface, AuthInterface> {
  readonly authContinuous$: Observable<AuthInterface>;
  readonly authErrorS$ = new Subject<Error>();
  readonly displayTextBS$ = new BehaviorSubject<string>(null);

  private _authDBKey = 'auth';
  private _authBS$WrapBS$ = new BehaviorSubject<BehaviorSubject<AuthInterface>>(null);
  private _localForage = localForage.createInstance({
    name: AuthDataSource.constructor.name,
  });
  private _loginUrl = `${apiUrl}${loginUrlSuffix}`;
  private _logoutUrl = `${apiUrl}${logoutUrlSuffix}`;

  constructor(
    private _httpClient: HttpClient,
  ) {
    this.authContinuous$ = this._waitForAuthBS$().pipe(
      mergeMap(authBS$ => authBS$),
    );
    this._localForage.getItem<AuthInterface>(this._authDBKey).then((auth) => {
      const authBS$ = new BehaviorSubject(auth);
      authBS$.subscribe(auth2 => {
        if (auth2) {
          this._localForage.setItem<AuthInterface>(this._authDBKey, auth2);
          this.displayTextBS$.next(auth2.login);
        } else {
          this._localForage.removeItem(this._authDBKey);
          this.displayTextBS$.next(null);
        }
      });
      this._authBS$WrapBS$.next(authBS$);
    });
  }

  public interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authContinuous$.pipe(
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
        if (error.status === 401 && req.url !== this._loginUrl && req.url !== this._logoutUrl) {
          return this._setAuth$(null).pipe(
            tap(() => {
              this.authErrorS$.next(error);
            }),
            mergeMap(() => this.authContinuous$),
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
    return this._httpClient.post(this._loginUrl, credentials, {
      responseType: 'text',
    }).pipe(
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
    return this._httpClient.post(this._logoutUrl, null).pipe(
      mergeMap(() => this._setAuth$(null)),
    );
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
