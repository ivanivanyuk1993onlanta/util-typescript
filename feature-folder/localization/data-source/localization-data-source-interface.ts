import {Observable} from 'rxjs';

export interface LocalizationDataSourceInterface {
  readonly currentLocaleContinuous$: Observable<string>;

  readonly localeListContinuous$: Observable<Array<string>>;

  getLocalizedMessageContinuous$(messageCode: string): Observable<string>;

  setLocale$(locale: string): Observable<string>;
}
