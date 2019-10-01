import {Observable, Subject} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

export interface AuthDataSourceInterface<AuthType, CredentialsType> {
  readonly authRequiredErrorS$: Subject<HttpErrorResponse>;
  readonly displayTextContinuous$: Observable<string>;
  readonly hasRegistration: boolean;
  readonly isLoggedInContinuous$: Observable<boolean>;
  readonly loginErrorS$: Subject<HttpErrorResponse>;

  interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;

  login$(credentials: CredentialsType): Observable<AuthType>;

  logout$(): Observable<AuthType>;
}
