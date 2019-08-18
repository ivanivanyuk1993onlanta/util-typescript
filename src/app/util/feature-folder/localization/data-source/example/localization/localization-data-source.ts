import {LocalizationDataSourceInterface} from '../../localization-data-source-interface';
import {BehaviorSubject, interval, Observable, of, Subject, timer} from 'rxjs';
import {buffer, debounceTime, filter, first, mergeMap, shareReplay, tap} from 'rxjs/operators';
import * as localForage from 'localforage';
import {LocaleWithMessageCodeInterface} from './locale-with-message-code-interface';
import {localizationMap} from './localization-map';

export class LocalizationDataSource implements LocalizationDataSourceInterface {
  localeListContinuous$: Observable<Array<string>>;

  private _currentLocaleBS$WrapBS$ = new BehaviorSubject<BehaviorSubject<string>>(null);
  private _currentLocaleContinuous$: Observable<string>;
  private _currentLocaleDBKey = 'currentLocale';
  private _currentLocaleLocalForage = localForage.createInstance({
    name: `${LocalizationDataSource.name}-${this._currentLocaleDBKey}`,
  });
  private _debounceTime = 0;
  private _localizationLocalForage = localForage.createInstance({
    name: LocalizationDataSource.name,
  });
  private _localeWithPrefixToLocalizedMessageBS$Map = new Map<string, BehaviorSubject<string>>();
  private _requestImitationTime = 100;
  private _requestedLocaleWithMessageCodeS$ = new Subject<LocaleWithMessageCodeInterface>();

  constructor() {
    this._currentLocaleContinuous$ = this._waitForCurrentLocaleBS$().pipe(
      mergeMap(currentLocaleBS$ => currentLocaleBS$),
      // using shareReplay to not duplicate streams, but still serve it to late subscribers
      shareReplay(1),
    );

    // this buffer collects requested localization keys and generates load request after some time after last request, in our case, 0 is
    // enough to collect all localization requests from page
    this._requestedLocaleWithMessageCodeS$.pipe(
      buffer(this._requestedLocaleWithMessageCodeS$.pipe(debounceTime(this._debounceTime))),
    ).subscribe(requestedLocaleWithMessageCodeList => {
      this._loadLocalizationMessageList$(requestedLocaleWithMessageCodeList).subscribe(localizationMessageList => {
        const localeWithPrefixToLocalizedMessageBS$Map = this._localeWithPrefixToLocalizedMessageBS$Map;
        localizationMessageList.forEach((localizationMessage, index) => {
          const localeWithMessageCode = requestedLocaleWithMessageCodeList[index];
          const localeWithMessageCodeString = this._getLocaleWithMessageCodeString(
            localeWithMessageCode.locale,
            localeWithMessageCode.messageCode,
          );
          if (localizationMessage) {
            // storing received value to in-memory map
            localeWithPrefixToLocalizedMessageBS$Map.get(localeWithMessageCodeString).next(localizationMessage);
            // storing received value to persistent storage
            this._localizationLocalForage.setItem<string>(localeWithMessageCodeString, localizationMessage);
          } else {
            // Not persisting not found value, but still storing it in memory
            localeWithPrefixToLocalizedMessageBS$Map.get(localeWithMessageCodeString).next(localeWithMessageCodeString);
          }
        });
      });
    });

    this._currentLocaleLocalForage.getItem<string>(this._currentLocaleDBKey).then((currentLocale) => {
      const currentLocaleBS$ = new BehaviorSubject(currentLocale || this._getNavigatorLanguage());
      currentLocaleBS$.subscribe(currentLocale2 => {
        this._currentLocaleLocalForage.setItem<string>(this._currentLocaleDBKey, currentLocale2);
      });

      // todo remove debug code
      const localeList = ['en', 'ru-RU'];
      interval(1000).subscribe((num) => {
        this.setLocale$(`${localeList[num % localeList.length]}`).subscribe();
      });

      this._currentLocaleBS$WrapBS$.next(currentLocaleBS$);
    });
  }

  public getLocalizedMessageContinuous$(messageCode: string): Observable<string> {
    // When writing method for your data source, pay attention that this method is very effective in combination with localization pipe, as
    // it requests only current locale, buffers locale requests before generating http requests, generates request for each
    // locale-messageCode only once

    // here template with pipe has appeared on page or method was called manually, subscription was created
    // we subscribe to continuous locale
    return this._currentLocaleContinuous$.pipe(
      mergeMap(locale => {
        // we get key from locale and messageCode
        const localeWithMessageCodeString = this._getLocaleWithMessageCodeString(locale, messageCode);
        // we try to get localization observable from in-memory map
        let inMemoryLocalizationMessageBS$ = this._localeWithPrefixToLocalizedMessageBS$Map.get(localeWithMessageCodeString);
        // if in-memory map doesn't have localization observable, we have to put it there
        if (!inMemoryLocalizationMessageBS$) {
          // we build and put to in-memory map localization observable
          inMemoryLocalizationMessageBS$ = new BehaviorSubject<string>(null);
          this._localeWithPrefixToLocalizedMessageBS$Map.set(localeWithMessageCodeString, inMemoryLocalizationMessageBS$);

          // we try to load localization from persistent storage
          this._localizationLocalForage.getItem<string>(localeWithMessageCodeString).then(localizationMessage => {
            // if persistent storage has localization, we push it to observable
            if (localizationMessage) {
              inMemoryLocalizationMessageBS$.next(localizationMessage);
            // else we notify requestedLocaleWithMessageCodeS$ with buffer logic that we need to load locale with message, as we do not want
            // each key to generate http request, but want to wait for all localization requests from page before sending requests
            } else {
              this._requestedLocaleWithMessageCodeS$.next({
                locale,
                messageCode,
              });
            }
          });
        }
        return inMemoryLocalizationMessageBS$;
      }),
      // we filter newly registered in map value, that does not have localization yet
      filter(x => !!x),
    );
  }

  public setLocale$(locale: string): Observable<string> {
    return this._waitForCurrentLocaleBS$().pipe(
      tap(currentLocaleBS$ => {
        currentLocaleBS$.next(locale);
      }),
      mergeMap(currentLocaleBS$ => currentLocaleBS$),
      first(),
    );
  }

  private _getNavigatorLanguage(): string {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
    } else {
      return navigator.language || 'en';
    }
  }

  private _getLocaleWithMessageCodeString(
    locale: string,
    messageCode: string,
  ): string {
    return `${locale}|${messageCode}`;
  }

  private _loadLocalizationMessageList$(
    localeWithMessageCodeList: Array<LocaleWithMessageCodeInterface>,
  ): Observable<Array<string>> {
    return timer(this._requestImitationTime).pipe(
      mergeMap(() => of(localeWithMessageCodeList.map(localeWithMessageCode => {
        if (localeWithMessageCode.locale === 'en') {
          return localeWithMessageCode.messageCode;
        } else {
          const jsonLocale = localizationMap[localeWithMessageCode.locale];
          if (jsonLocale) {
            return jsonLocale[localeWithMessageCode.messageCode];
          }
          return null;
        }
      }))),
    );
  }

  private _waitForCurrentLocaleBS$(): Observable<BehaviorSubject<string>> {
    return this._currentLocaleBS$WrapBS$.pipe(
      filter(x => !!x),
    );
  }
}
