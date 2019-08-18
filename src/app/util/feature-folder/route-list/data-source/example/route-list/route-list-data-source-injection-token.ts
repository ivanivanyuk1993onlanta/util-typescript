import {inject, InjectionToken} from '@angular/core';
import {RouteListDataSource} from './route-list-data-source';
import {LocalizationService} from '../../../../localization/localization/localization.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../../auth/auth/auth.service';

export const ROUTE_LIST_DATA_SOURCE = new InjectionToken<RouteListDataSource>('Manually constructed RouteListDataSource', {
  providedIn: 'root',
  factory: () => new RouteListDataSource(
    inject(AuthService),
    inject(HttpClient),
    inject(LocalizationService),
  ),
});
