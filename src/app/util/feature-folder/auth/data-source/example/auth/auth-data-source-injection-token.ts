import {inject, InjectionToken} from '@angular/core';
import {AuthDataSource} from './auth-data-source';
import {HttpClient} from '@angular/common/http';

export const AUTH_DATA_SOURCE = new InjectionToken<AuthDataSource>('Manually constructed AuthDataSource', {
  providedIn: 'root',
  factory: () => new AuthDataSource(inject(HttpClient)),
});
