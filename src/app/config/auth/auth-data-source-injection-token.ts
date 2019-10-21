import {inject, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthDataSource} from '../../util-angular/feature-folder/auth/data-source/example/auth/auth-data-source';

export const AUTH_DATA_SOURCE = new InjectionToken<AuthDataSource>('Manually constructed AuthDataSource', {
  providedIn: 'root',
  factory: () => new AuthDataSource(inject(HttpClient)),
});
