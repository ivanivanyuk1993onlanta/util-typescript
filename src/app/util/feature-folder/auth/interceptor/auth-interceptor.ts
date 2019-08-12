import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class AuthInterceptor<AuthType, CredentialsType> implements HttpInterceptor {
  constructor(
    private _authService: AuthService<AuthType, CredentialsType>,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._authService.authDataSource.interceptHttp$(req, next);
  }
}
