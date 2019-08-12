import {Observable, Subject} from 'rxjs';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

export interface AuthDataSourceInterface<AuthType, CredentialsType> {
  readonly authErrorS$: Subject<Error>;
  readonly displayTextContinuous$: Observable<string>;
  readonly isLoggedInContinuous$: Observable<boolean>;

  interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;

  login$(credentials: CredentialsType): Observable<AuthType>;

  logout$(): Observable<AuthType>;
}
