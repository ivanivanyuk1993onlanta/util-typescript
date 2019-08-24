import {InjectionToken} from '@angular/core';
import {CredentialsDataSource} from '../../util/feature-folder/auth/data-source/example/auth/credentials-data-source';

export const CREDENTIALS_DATA_SOURCE = new InjectionToken<CredentialsDataSource>('Manually constructed CredentialsDataSource', {
  providedIn: 'root',
  factory: () => new CredentialsDataSource(),
});
