import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

export interface AuthDataSourceInterface<CredentialsType, AuthType> {
  readonly authContinuous$: Observable<AuthType>;
  readonly authErrorS$: Subject<Error>;
  readonly displayTextBS$: BehaviorSubject<string>;

  interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;

  login$(credentials: CredentialsType): Observable<AuthType>;

  logout$(): Observable<AuthType>;
}
