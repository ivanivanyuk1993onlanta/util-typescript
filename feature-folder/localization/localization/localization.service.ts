import {Inject, Injectable} from '@angular/core';
import {LocalizationDataSourceInterface} from '../data-source/localization-data-source-interface';
import {LOCALIZATION_DATA_SOURCE} from '../../../src/app/config/localization/localization-data-source-injection-token';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  constructor(
    @Inject(LOCALIZATION_DATA_SOURCE) public localizationDataSource: LocalizationDataSourceInterface,
  ) {
  }
}
