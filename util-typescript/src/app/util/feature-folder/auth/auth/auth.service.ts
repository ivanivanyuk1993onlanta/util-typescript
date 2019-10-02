import {Injectable} from '@angular/core';
import {AuthDataSourceInterface} from '../data-source/auth-data-source-interface';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import * as localForage from 'localforage';
import {catchError, filter, first, map, mergeMap, tap} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import {logoutUrlSuffix} from './logout-url-suffix';
import {loginUrlSuffix} from './login-url-suffix';
import {apiUrl} from '../../../../config/api-url';
import {CredentialsInterface} from './credentials-interface';
import {AuthInterface} from './auth-interface';
import {FieldDataInterface} from '../data-source/field-data-interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {AuthModalComponent} from '../auth-modal/auth-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthDataSourceInterface<CredentialsInterface, AuthInterface> {
  private static _authDBKey = 'auth';

  readonly authContinuous$: Observable<AuthInterface>;
  readonly displayTextBS$ = new BehaviorSubject<string>(null);

  private _authBS$WrapBS$ = new BehaviorSubject<BehaviorSubject<AuthInterface>>(null);
  private _isDialogOpenedBS$ = new BehaviorSubject(false);
  private _localForage = localForage.createInstance({
    name: AuthService.constructor.name,
  });
  private _matDialogRef: MatDialogRef<AuthModalComponent<CredentialsInterface, AuthInterface>>;

  constructor(
    private _httpClient: HttpClient,
    private _matDialog: MatDialog,
  ) {
    this.authContinuous$ = this._waitForAuthBS$().pipe(
      mergeMap(authBS$ => authBS$),
    );
    this._localForage.getItem<AuthInterface>(AuthService._authDBKey).then((auth) => {
      const authBS$ = new BehaviorSubject(auth);
      authBS$.subscribe(auth2 => {
        if (auth2) {
          this._localForage.setItem<AuthInterface>(AuthService._authDBKey, auth2);
          this.displayTextBS$.next(auth2.login);
        } else {
          this._localForage.removeItem(AuthService._authDBKey);
          this.displayTextBS$.next(null);
        }
      });
      this._authBS$WrapBS$.next(authBS$);
    });
  }

  private static _getLoginUrl(): string {
    return `${apiUrl}${loginUrlSuffix}`;
  }

  private static _getLogoutUrl(): string {
    return `${apiUrl}${logoutUrlSuffix}`;
  }

  public closeModal$(): Observable<void> {
    this._matDialogRef.close();
    return of();
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
        if (error.status === 401 && req.url !== AuthService._getLoginUrl() && req.url !== AuthService._getLogoutUrl()) {
          return this._setAuth$(null).pipe(
            tap(() => {
              this.openModal$();
              // todo
              // notify(error.message, 'error');
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
    return this._httpClient.post(AuthService._getLoginUrl(), credentials, {
      responseType: 'text',
    }).pipe(
      tap(
        () => {},
        error => {
          // todo
          // notify(error.message, 'error');
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

  public openModal$(): Observable<void> {
    if (!this._isDialogOpenedBS$.getValue()) {
      this._isDialogOpenedBS$.next(true);
      this._matDialogRef = this._matDialog.open(AuthModalComponent);
      this._matDialogRef.beforeClose().pipe(
        first(),
      ).subscribe(() => {
        this._isDialogOpenedBS$.next(false);
      });
    }
    return of();
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
