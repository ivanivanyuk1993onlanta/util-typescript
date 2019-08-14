import {LocalizationDataSourceInterface} from '../../util/feature-folder/localization/data-source/localization-data-source-interface';
import {BehaviorSubject, interval, Observable, of, Subject} from 'rxjs';
import {buffer, debounceTime, filter, first, mergeMap, shareReplay, tap} from 'rxjs/operators';
import * as localForage from 'localforage';

export class LocalizationDataSource implements LocalizationDataSourceInterface {
  localeListContinuous$: Observable<Array<string>>;

  private _currentLocaleBS$WrapBS$ = new BehaviorSubject<BehaviorSubject<string>>(null);
  private _currentLocaleContinuous$: Observable<string>;
  private _currentLocaleDBKey = 'currentLocale';
  private _currentLocaleLocalForage = localForage.createInstance({
    name: `${LocalizationDataSource.name}-${this._currentLocaleDBKey}`,
  });
  private _debounceTime = 0;
  // todo use it to persist localization
  private _localizationLocalForage = localForage.createInstance({
    name: LocalizationDataSource.name,
  });
  private _localeWithPrefixToLocalizedMessageBS$Map = new Map<string, BehaviorSubject<string>>();
  private _requestedLocaleWithMessageCodeS$ = new Subject<string>();

  constructor() {
    this._currentLocaleContinuous$ = this._waitForCurrentLocaleBS$().pipe(
      mergeMap(currentLocaleBS$ => currentLocaleBS$),
      // using shareReplay to not duplicate streams, but still serve it to late subscribers
      shareReplay(1),
    );

    this._requestedLocaleWithMessageCodeS$.pipe(
      buffer(this._requestedLocaleWithMessageCodeS$.pipe(debounceTime(this._debounceTime))),
    ).subscribe(requestedLocaleWithMessageCodeList => {
      console.log(requestedLocaleWithMessageCodeList);
      this._loadLocalizationMessageList$(requestedLocaleWithMessageCodeList).subscribe(localizationMessageList => {
        const localeWithPrefixToLocalizedMessageBS$Map = this._localeWithPrefixToLocalizedMessageBS$Map;
        localizationMessageList.forEach((localizationMessage, index) => {
          localeWithPrefixToLocalizedMessageBS$Map.get(requestedLocaleWithMessageCodeList[index]).next(localizationMessage);
        });
      });
    });

    this._currentLocaleLocalForage.getItem<string>(this._currentLocaleDBKey).then((currentLocale) => {
      const currentLocaleBS$ = new BehaviorSubject(currentLocale || 'en');
      currentLocaleBS$.subscribe(currentLocale2 => {
        this._currentLocaleLocalForage.setItem<string>(this._currentLocaleDBKey, currentLocale2);
      });

      // todo remove debug code
      const localeList = ['en', 'ru', 'ge', 'jp'];
      interval(1000).subscribe((num) => {
        this.setLocale$(`${localeList[num % localeList.length]}`).subscribe();
      });

      this._currentLocaleBS$WrapBS$.next(currentLocaleBS$);
    });
  }

  public getLocalizedMessageContinuous$(messageCode: string): Observable<string> {
    // todo pay attention that method takes only message code and is used in pure pipe, so it has to either return self-recomputing
    //  Observable(which is not effective, as even keys that were removed from page will be recomputed on locale change), or take both
    //  messageCode and locale, which will require moving locale passing logic to either pipe transform method(best choice, if possible), or
    //  into template(which is not DRY, not readable, not easy to use)

    // todo try getting by key from in-memory map, then from persistent storage, then if got from persistent storage - register in
    //  in-memory map, else, add BehaviorSubject<LocalizedMessage> to in-memory map by key Locale+MessageCode, but with null value, add key
    //  to requested key list - BehaviorSubject<Array<Locale+MessageCode>>, which will have subscription that sends list to server
    //  on debounced(because it will likely send data to server, which we do not want to happen for each key one by one) requested key list
    //  change and sends values to in-memory map and persistent storage
    return this._currentLocaleContinuous$.pipe(
      mergeMap(locale => {
        const localeWithMessageCode = this._getLocaleWithMessageCode(locale, messageCode);
        let inMemoryLocalizationMessageBS$ = this._localeWithPrefixToLocalizedMessageBS$Map.get(localeWithMessageCode);
        if (!inMemoryLocalizationMessageBS$) {
          inMemoryLocalizationMessageBS$ = new BehaviorSubject<string>(null);
          this._localeWithPrefixToLocalizedMessageBS$Map.set(localeWithMessageCode, inMemoryLocalizationMessageBS$);
          this._requestedLocaleWithMessageCodeS$.next(localeWithMessageCode);
        }
        return inMemoryLocalizationMessageBS$;
      }),
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

  private _getLocaleWithMessageCode(
    locale: string,
    messageCode: string,
  ): string {
    return `${locale}|${messageCode}`;
  }

  private _loadLocalizationMessageList$(
    localeWithMessageCodeList: Array<string>,
  ): Observable<Array<string>> {
    return of(localeWithMessageCodeList);
  }

  private _waitForCurrentLocaleBS$(): Observable<BehaviorSubject<string>> {
    return this._currentLocaleBS$WrapBS$.pipe(
      filter(x => !!x),
    );
  }
}
