import { AuthDataSourceInterface } from "../AuthDataSourceInterface";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { AuthRequiredError } from "../AuthRequiredError";
import { FieldMessageDataType } from "../../../FieldMessageData/FieldMessageDataType";
import { AuthDataSourceConfigInterface } from "./AuthDataSourceConfigInterface";
import { HttpClientInterface } from "../../Http/HttpClient/HttpClientInterface";
import { PersistentStorageInterface } from "../../PersistentStorage/PersistentStorageInterface";
import { catchError, filter, first, map, mergeMap, tap } from "rxjs/operators";
import { AuthInterface } from "../AuthInterface";
import { HttpHandlerInterface } from "../../Http/HttpHandler/HttpHandlerInterface";
import { getSharedObservableWithLastValue } from "../../../getSharedObservableWithLastValue/getSharedObservableWithLastValue";
import { unauthorizedErrorHttpStatusCode } from "../../Http/HttpStatusCode/unauthorizedErrorHttpStatusCode";

export class AuthDataSource implements AuthDataSourceInterface {
  readonly authContinuous$: Observable<AuthInterface | undefined>;
  readonly authRequiredErrorS$ = new Subject<AuthRequiredError>();
  readonly hasRegistration: boolean;

  private _authBS$ = new BehaviorSubject<AuthInterface>({
    id: 0,
    token: ""
  });
  private _authIdHeaderName: string;
  private _authStorageKey = "auth";
  private _httpClient: HttpClientInterface;
  private _isReadyBS$ = new BehaviorSubject(false);
  private _logInUrl: string;
  private _logOutUrl: string;
  private _persistentStorage: PersistentStorageInterface;
  private _tokenHeaderName: string;

  constructor(config: AuthDataSourceConfigInterface) {
    this._authIdHeaderName = config.authIdHeaderName;
    this._httpClient = config.httpClient;
    this._logInUrl = config.logInUrl;
    this._logOutUrl = config.logOutUrl;
    this._persistentStorage = config.persistentStorage;
    this._tokenHeaderName = config.tokenHeaderName;
    this.hasRegistration = config.hasRegistration;

    this.authContinuous$ = getSharedObservableWithLastValue(
      this._getReadyAuthBS$$().pipe(mergeMap(authBS$ => authBS$))
    );
    this.authContinuous$.pipe(
      tap(auth => {
        if (auth) {
          this._persistentStorage.setAsync(this._authStorageKey, auth);
        } else {
          this._persistentStorage.deleteAsync(this._authStorageKey);
        }
      })
    );

    this._persistentStorage
      .getAsync<string, AuthInterface>(this._authStorageKey)
      .then(auth => {
        this._authBS$.next(auth);
        this._isReadyBS$.next(true);
      });
  }

  interceptHttp$(
    request: Request,
    nextHandler: HttpHandlerInterface
  ): Observable<HttpHandlerInterface> {
    return this.authContinuous$.pipe(
      first(),
      map(auth => {
        if (auth) {
          request.headers.append(this._authIdHeaderName, String(auth.id));
          request.headers.append(this._tokenHeaderName, auth.token);
        }
        return {
          handleHttp$: (request1: Request): Observable<Response> => {
            return nextHandler.handleHttp$(request1).pipe(
              map(response => {
                if (response.status !== unauthorizedErrorHttpStatusCode) {
                  return response;
                } else {
                  const error = new AuthRequiredError();
                  this.authRequiredErrorS$.next(error);
                  throw error;
                }
              }),
              catchError((err, caught) => {
                if (err instanceof AuthRequiredError) {
                  return this.authContinuous$.pipe(
                    first(),
                    // Waiting for user login
                    mergeMap(auth =>
                      this._setAuthWhenReady$({
                        ...auth,
                        isLoggedIn: false
                      })
                    ),
                    filter(isLoggedIn => isLoggedIn),
                    first(),
                    mergeMap(() => caught)
                  );
                } else {
                  return throwError(err);
                }
              }),
              mergeMap(response => {
                return this.authContinuous$.pipe(
                  first(),
                  mergeMap(auth => {
                    return this._setAuthWhenReady$({
                      ...auth,
                      id: Number(response.headers.get(this._authIdHeaderName)),
                      token: response.headers.get(this._tokenHeaderName) || ""
                    });
                  }),
                  map(() => response)
                );
              })
            );
          }
        };
      })
    );
  }

  logIn$(
    credentialsFieldMessageDataList: FieldMessageDataType[]
  ): Observable<void> {
    return this._httpClient
      .fetch$(this._logInUrl, {
        body: JSON.stringify(credentialsFieldMessageDataList)
      })
      .pipe(
        mergeMap(response => response.json()),
        mergeMap(responseJson => this._setAuthWhenReady$(responseJson))
      );
  }

  logOut$(): Observable<void> {
    return this._httpClient.fetch$(this._logOutUrl).pipe(
      mergeMap(response => response.json()),
      mergeMap(responseJson => this._setAuthWhenReady$(responseJson))
    );
  }

  private _getReadyAuthBS$$(): Observable<
    BehaviorSubject<AuthInterface | undefined>
  > {
    return this._isReadyBS$.pipe(
      filter(isReady => isReady),
      map(() => this._authBS$)
    );
  }

  private _setAuthWhenReady$(auth: AuthInterface): Observable<void> {
    return this._getReadyAuthBS$$().pipe(
      first(),
      tap(authBS$ => {
        authBS$.next(auth);
      }),
      map(() => undefined)
    );
  }
}
