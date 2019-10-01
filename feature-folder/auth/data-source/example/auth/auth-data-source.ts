import {AuthDataSourceInterface} from '../../auth-data-source-interface';
import {CredentialsInterface} from './credentials-interface';
import {AuthInterface} from './auth-interface';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, filter, first, map, mergeMap, shareReplay, tap} from 'rxjs/operators';
import {apiUrl} from '../../../../../src/app/config/api-url';
import {logoutUrlSuffix} from './logout-url-suffix';
import {loginUrlSuffix} from './login-url-suffix';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import * as localForage from 'localforage';

export class AuthDataSource implements AuthDataSourceInterface<AuthInterface, CredentialsInterface> {
  readonly authRequiredErrorS$ = new Subject<HttpErrorResponse>();
  readonly displayTextContinuous$: Observable<string>;
  readonly hasRegistration = true;
  readonly isLoggedInContinuous$: Observable<boolean>;
  readonly loginErrorS$ = new Subject<HttpErrorResponse>();

  private readonly _authContinuous$: Observable<AuthInterface>;
  private _authBS$WrapBS$ = new BehaviorSubject<BehaviorSubject<AuthInterface>>(null);
  private _authDBKey = 'auth';
  private _localForage = localForage.createInstance({
    name: AuthDataSource.name,
  });
  private _loginUrl = `${apiUrl}${loginUrlSuffix}`;
  private _logoutUrl = `${apiUrl}${logoutUrlSuffix}`;

  constructor(
    private _httpClient: HttpClient,
  ) {
    this._authContinuous$ = this._waitForAuthBS$().pipe(
      mergeMap(authBS$ => authBS$),
      // using shareReplay to not duplicate streams, but still serve it to late subscribers
      shareReplay(1),
    );
    this.displayTextContinuous$ = this._authContinuous$.pipe(
      map(auth => auth.login),
      distinctUntilChanged(),
      // using shareReplay to not duplicate streams, but still serve it to late subscribers
      shareReplay(1),
    );
    this.isLoggedInContinuous$ = this._authContinuous$.pipe(
      map(auth => auth.isLoggedIn),
      distinctUntilChanged(),
      // using shareReplay to not duplicate streams, but still serve it to late subscribers
      shareReplay(1),
    );

    this._localForage.getItem<AuthInterface>(this._authDBKey).then((auth) => {
      const authBS$ = new BehaviorSubject(auth || this._getEmptyAuth());
      authBS$.subscribe(auth2 => {
        this._localForage.setItem<AuthInterface>(this._authDBKey, auth2);
      });
      this._authBS$WrapBS$.next(authBS$);
    });
  }

  public interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // todo add token extraction from response and storing in auth logic to allow for paranoid level security (server will answer with new
    //  token if more than some seconds passed, still remembering and allowing old token for some seconds)
    return this._authContinuous$.pipe(
      first(),
      mergeMap(auth => {
        return next.handle(
          auth.token
            ? req.clone({
              setHeaders: {
                Authorization: `Bearer ${auth.token}`,
              },
            })
            : req
        );
      }),
      catchError((error: HttpErrorResponse, caught) => {
        if (error.status === 401 && req.url !== this._loginUrl && req.url !== this._logoutUrl) {
          return this._setAuth$(this._getEmptyAuth()).pipe(
            tap(() => {
              this.authRequiredErrorS$.next(error);
            }),
            // Waiting for user login
            mergeMap(() => this.isLoggedInContinuous$),
            filter(isLoggedIn => isLoggedIn),
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
    // this code is for demo app that should work without server, comment is to ease migrating
    return of('1').pipe(
    // this._httpClient.post(this._loginUrl, credentials, {
    //   responseType: 'text',
    // }).pipe(
      map((jwtToken) => {
        return {
          isLoggedIn: true,
          token: jwtToken,
          login: credentials.login,
        } as AuthInterface;
      }),
      mergeMap(auth => this._setAuth$(auth)),
    );
  }

  public logout$(): Observable<AuthInterface> {
    // this code is for demo app that should work without server, comment is to ease migrating
    return of(null).pipe(
    // return this._httpClient.post(this._logoutUrl, null).pipe(
      mergeMap(() => this._setAuth$(this._getEmptyAuth())),
    );
  }

  private _getEmptyAuth(): AuthInterface {
    return {
      isLoggedIn: false,
      token: null,
      login: null,
    };
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
