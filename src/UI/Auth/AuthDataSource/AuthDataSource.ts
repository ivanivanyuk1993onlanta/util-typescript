import { AuthDataSourceInterface } from "../AuthDataSourceInterface";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { AuthRequiredError } from "../AuthRequiredError";
import { FieldMessageDataType } from "../../../MessageTransfer/FieldMessageDataType";
import { AuthDataSourceConfigInterface } from "./AuthDataSourceConfigInterface";
import { HttpClientInterface } from "../../HttpClient/HttpClientInterface";
import { PersistentStorageInterface } from "../../PersistentStorage/PersistentStorageInterface";
import { map, tap } from "rxjs/operators";
import { AuthInterface } from "../AuthInterface";

export class AuthDataSource implements AuthDataSourceInterface {
  readonly authContinuous$: Observable<AuthInterface | undefined>;
  readonly authRequiredErrorS$ = new Subject<AuthRequiredError>();
  readonly hasRegistration: boolean;

  private _authBS$ = new BehaviorSubject<AuthInterface | undefined>(undefined);
  private _authStorageKey = "auth";
  private _httpClient: HttpClientInterface;
  private _logInUrl: string;
  private _logOutUrl: string;
  private _persistentStorage: PersistentStorageInterface;

  constructor(config: AuthDataSourceConfigInterface) {
    this.hasRegistration = config.hasRegistration;
    this._httpClient = config.httpClient;
    this._logInUrl = config.logInUrl;
    this._logOutUrl = config.logOutUrl;
    this._persistentStorage = config.persistentStorage;

    this.authContinuous$ = this._authBS$;

    this._persistentStorage
      .getAsync<string, AuthInterface>(this._authStorageKey)
      .then(auth => {
        if (auth) {
          this._authBS$.next(auth);
        }
        this._authBS$.pipe(
          tap(auth => {
            if (auth) {
              this._persistentStorage.setAsync(this._authStorageKey, auth);
            } else {
              this._persistentStorage.deleteAsync(this._authStorageKey);
            }
          })
        );
      });
  }

  logIn$(
    credentialsFieldMessageDataList: FieldMessageDataType[]
  ): Observable<void> {
    return this._httpClient
      .fetch$(this._logInUrl, {
        body: JSON.stringify(credentialsFieldMessageDataList)
      })
      .pipe(
        tap(response => {
          response.json().then(responseJson => {
            this._authBS$.next(responseJson);
          });
        }),
        map(() => undefined)
      );
  }

  logOut$(): Observable<void> {
    return this._httpClient.fetch$(this._logOutUrl).pipe(
      tap(response => {
        response.json().then(responseJson => {
          this._authBS$.next(responseJson);
        });
      }),
      map(() => undefined)
    );
  }
}
