import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {FieldDataInterface} from './field-data-interface';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

export interface AuthDataSourceInterface<CredentialsType, AuthType> {
  readonly displayTextBS$: BehaviorSubject<string>;
  readonly error401S$: Subject<HttpErrorResponse>;

  getAuthContinuous$(): Observable<AuthType>;

  getEmptyCredentialsFormGroup$(): Observable<FormGroup>;

  getLoginFormFieldDataList$(): Observable<Array<FieldDataInterface>>;

  interceptHttp$(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;

  login$(credentials: CredentialsType): Observable<AuthType>;

  logout$(): Observable<AuthType>;
}
