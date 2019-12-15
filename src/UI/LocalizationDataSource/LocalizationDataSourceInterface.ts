import { Observable } from "rxjs";

export interface LocalizationDataSourceInterface {
  /**
   * Property implementation should contain Observable with list of available
   * locales
   */
  readonly availableLocaleListContinuous$: Observable<string[]>;

  /**
   * Property implementation should contain Observable with current locale code
   */
  readonly currentLocaleContinuous$: Observable<string>;

  /**
   * Method implementation should return localized message for code for current
   * locale
   * @param messageCode
   */
  getLocalizedMessageContinuous$(messageCode: string): Observable<string>;

  /**
   * Method implementation should set current locale and return void on set
   * completion
   * @param locale
   */
  setLocale$(locale: string): Observable<void>;
}
