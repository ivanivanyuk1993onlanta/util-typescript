import {Inject, Injectable} from '@angular/core';
import {AuthDataSourceInterface} from '../data-source/auth-data-source-interface';
import {AUTH_DATA_SOURCE} from '../../../config/auth/auth-data-source-injection-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService<CredentialsType, AuthType> {
  constructor(
    @Inject(AUTH_DATA_SOURCE) public authDataSource: AuthDataSourceInterface<CredentialsType, AuthType>,
  ) {
  }
}
