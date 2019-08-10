import {BehaviorSubject, Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {FieldDataInterface} from './field-data-interface';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

export interface AuthDataSourceInterface<CredentialsType, AuthType> {
  readonly authContinuous$: Observable<AuthType>;
  readonly displayTextBS$: BehaviorSubject<string>;

  getEmptyCredentialsFormGroup$(): Observable<FormGroup>;

  getLoginFormFieldDataList$(): Observable<Array<FieldDataInterface>>;

  interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;

  login$(credentials: CredentialsType): Observable<AuthType>;

  logout$(): Observable<AuthType>;
}
