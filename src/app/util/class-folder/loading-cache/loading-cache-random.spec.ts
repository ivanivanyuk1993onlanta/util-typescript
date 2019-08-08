import {Observable, timer} from 'rxjs';
import {ILoadResult} from './i-load-result';
import {getRandomIntFromInterval} from '../../method-folder/get-random-int-from-interval';
import {first, map} from 'rxjs/operators';
import {ILoadingCacheLoader} from './i-loading-cache-loader';

const maxLoadTime = 1000;

interface CallRandomData {
  shouldThrowError: number;
  waitTime: number;
}

interface CallAnalyticsData {
  finishTime: number;
  initiator: 'get' | 'set';
  randomLoadTime: number;
  result: any;
  startTime: number;
}

interface TestRecord {
  key: string;
  loadCount: number;
  storeCount: number;
  storeValue: any;
}

class TestCacheLoader implements ILoadingCacheLoader<string, TestRecord> {
  private _keyToLoadCountMap = new Map<string, number>();
  private _keyToStoreCountMap = new Map<string, number>();
  private _keyToStoreValueMap = new Map<string, any>();

  load$(
    key: string,
  ): Observable<ILoadResult<TestRecord>> {
    const startTime = Date.now();

    const loadTime = getRandomIntFromInterval(0, maxLoadTime);
    const shouldThrowError = Math.random() > 0.5;

    return timer(loadTime).pipe(
      map(() => {
        if (shouldThrowError) {
          throw new Error();
        } else {
          this._initKeyIfNotExists(key);
          this._keyToLoadCountMap.set(key, this._keyToLoadCountMap.get(key) + 1);

          return {
            timestamp: Date.now(),
            value: {
              key,
              loadCount: this._keyToLoadCountMap.get(key),
              storeCount: this._keyToStoreCountMap.get(key),
              storeValue: this._keyToStoreValueMap.get(key),
            }
          };
        }
      }),
      first(),
    );
  }

  store$(
    key: string,
    value: TestRecord,
  ): Observable<ILoadResult<TestRecord>> {
    const loadTime = getRandomIntFromInterval(0, maxLoadTime);
    const shouldThrowError = Math.random() > 0.5;

    return timer(loadTime).pipe(
      map(() => {
        if (shouldThrowError) {
          throw new Error();
        } else {
          this._initKeyIfNotExists(key);
          this._keyToStoreCountMap.set(key, this._keyToStoreCountMap.get(key) + 1);

          return {
            timestamp: Date.now(),
            value: {
              key,
              loadCount: this._keyToLoadCountMap.get(key),
              storeCount: this._keyToStoreCountMap.get(key),
              storeValue: value,
            }
          };
        }
      }),
      first(),
    );
  }

  private _initKeyIfNotExists(
    key: string
  ) {
    if (!this._keyToLoadCountMap.has(key)) {
      this._keyToLoadCountMap.set(key, 0);
      this._keyToStoreCountMap.set(key, 0);
      this._keyToStoreValueMap.set(key, null);
    }
  }
}
