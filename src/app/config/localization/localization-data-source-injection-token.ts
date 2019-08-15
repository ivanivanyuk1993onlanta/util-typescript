import {InjectionToken} from '@angular/core';
import {LocalizationDataSource} from './localization-data-source';

export const LOCALIZATION_DATA_SOURCE = new InjectionToken<LocalizationDataSource>('Manually constructed LocalizationDataSource', {
  providedIn: 'root',
  factory: () => new LocalizationDataSource(),
});
