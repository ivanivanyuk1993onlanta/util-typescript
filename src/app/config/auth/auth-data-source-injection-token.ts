import {InjectionToken} from '@angular/core';
import {AuthDataSourceInterface} from '../../feature-folder/auth/data-source/auth-data-source-interface';
import {CredentialsInterface} from './credentials-interface';
import {AuthInterface} from './auth-interface';
import {AuthDataSource} from './auth-data-source';
import {GlobalInjector} from '../../app.component';
import {HttpClient} from '@angular/common/http';

export const AUTH_DATA_SOURCE = new InjectionToken<AuthDataSourceInterface<CredentialsInterface, AuthInterface>>('Auth data source', {
  providedIn: 'root',
  factory: () => new AuthDataSource(GlobalInjector.get<HttpClient>(HttpClient)),
});
