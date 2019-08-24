import {InjectionToken} from '@angular/core';
import {LocalizationDataSource} from '../../util/feature-folder/localization/data-source/example/localization/localization-data-source';

export const LOCALIZATION_DATA_SOURCE = new InjectionToken<LocalizationDataSource>('Manually constructed LocalizationDataSource', {
  providedIn: 'root',
  factory: () => new LocalizationDataSource(),
});
