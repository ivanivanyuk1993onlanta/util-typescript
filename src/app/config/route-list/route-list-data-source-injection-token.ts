import {inject, InjectionToken} from '@angular/core';
import {RouteListDataSource} from './route-list-data-source';
import {LocalizationService} from '../../util/feature-folder/localization/localization/localization.service';
import {HttpClient} from '@angular/common/http';

export const ROUTE_LIST_DATA_SOURCE = new InjectionToken<RouteListDataSource>('Manually constructed RouteListDataSource', {
  providedIn: 'root',
  factory: () => new RouteListDataSource(
    inject(HttpClient),
    inject(LocalizationService),
  ),
});
