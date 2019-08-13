import {Observable} from 'rxjs';

export interface LocalizationDataSourceInterface {
  localeListContinuous$: Observable<Array<string>>;

  getLocalizedMessageContinuous$(messageCode: string): Observable<string>;

  setLocale$(locale: string): Observable<string>;
}
