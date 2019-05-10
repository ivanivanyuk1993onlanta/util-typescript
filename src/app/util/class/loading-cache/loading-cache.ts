import {BehaviorSubject, Observable, race} from 'rxjs';
import {ILoadingCacheRecord} from './i-loading-cache-record';
import {filter, first, map, mapTo, skip, timeout} from 'rxjs/operators';
import {ILoadingCacheLoader} from './i-loading-cache-loader';
import {StoreResultNotActualError} from './store-result-not-actual-error';
import {ILoadingCacheConfig} from './i-loading-cache-config';
import {ILoadResult} from './i-load-result';

export class LoadingCache<K, V> {
  private readonly _cacheLoader: ILoadingCacheLoader<K, V>;
  private readonly _map = new Map<K, BehaviorSubject<ILoadingCacheRecord<V>>>();
  private readonly _refreshTime: number;
  private readonly _spoilTime: number;
  private readonly _timeout: number;

  constructor(config: ILoadingCacheConfig<K, V>) {
    this._cacheLoader = config.cacheLoader;
    this._refreshTime = config.refreshTime;
    this._spoilTime = config.spoilTime;
    this._timeout = config.timeout;
  }

  public get$(
    key: K,
  ): Observable<V> {
    const recordBS$ = this._getOrRegisterRecordBS$(key);
    const record = recordBS$.getValue();

    if (this._shouldRefreshRecord(record) && !record.isLoading) {
      record.isLoading = true;
      record.error = null;

      race<ILoadResult<V>>(
        this._cacheLoader.load$(key),
        recordBS$.pipe( // set$ can update record during load
          skip(1),
          mapTo(null),
        ),
      ).pipe(
        timeout(this._timeout),
        first(),
      ).subscribe(
        loadResultOrNull => {
          if (loadResultOrNull) {
            if (this._isLoadResultActual(loadResultOrNull, record)) {
              record.value = loadResultOrNull.value;
              record.valueTimestamp = loadResultOrNull.timestamp;

              record.isLoading = false;
              recordBS$.next(record);
            } else {
              recordBS$.next(record);
            }
          }
        },
        error => {
          record.error = error;

          record.isLoading = false;
          recordBS$.next(record);
        },
      );
    }

    return recordBS$.pipe(
      filter(recordLocal => !this._isRecordSpoiled(recordLocal) || !recordLocal.isLoading),
      map(recordLocal => {
        if (recordLocal.error) {
          throw recordLocal.error;
        }
        return recordLocal.value;
      }),
      first(),
    );
  }

  public set$(
    key: K,
    value: V,
  ): Observable<V> {
    const recordBS$ = this._getOrRegisterRecordBS$(key);
    const record = recordBS$.getValue();

    return this._cacheLoader.store$(key, value).pipe(
      map(loadResult => {
        if (this._isLoadResultActual(loadResult, record)) {
          record.value = loadResult.value;
          record.valueTimestamp = loadResult.timestamp;

          record.isLoading = false;
          recordBS$.next(record); // broadcast updated value
          return record.value;
        } else {
          throw new StoreResultNotActualError();
        }
      }),
      timeout(this._timeout),
      first(),
    );
  }

  private _getOrRegisterRecordBS$(
    key: K,
  ): BehaviorSubject<ILoadingCacheRecord<V>> {
    let recordBS$ = this._map.get(key);
    if (!recordBS$) {
      recordBS$ = new BehaviorSubject<ILoadingCacheRecord<V>>({
        error: null,
        isLoading: null,
        value: null,
        valueTimestamp: null,
      });
      this._map.set(key, recordBS$);
    }
    return recordBS$;
  }

  private _isLoadResultActual(
    loadResult: ILoadResult<V>,
    record: ILoadingCacheRecord<V>,
  ): boolean {
    return loadResult.timestamp > record.valueTimestamp && !(Date.now() - loadResult.timestamp > this._spoilTime);
  }

  private _isRecordSpoiled(
    record: ILoadingCacheRecord<V>,
  ): boolean {
    return Date.now() - record.valueTimestamp > this._spoilTime;
  }

  private _shouldRefreshRecord(
    record: ILoadingCacheRecord<V>,
  ): boolean {
    return Date.now() - record.valueTimestamp > this._refreshTime;
  }
}
