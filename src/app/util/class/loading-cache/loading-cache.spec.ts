import {LoadingCache} from './loading-cache';
import {forkJoin, Observable, of, throwError, timer} from 'rxjs';
import {first, map, tap} from 'rxjs/operators';
import {ILoadResult} from './i-load-result';
import {ILoadingCacheLoader} from './i-loading-cache-loader';
import {TestBed} from '@angular/core/testing';

const allowedInstantTimeDifference = 1;
const loadTime = 50;
const refreshTime = 100;
const spoilTime = 1000;
const timeout = 200;

interface TestKey {
  key: string;
  loadTime?: number;
  shouldThrowError?: boolean;
}

interface TestRecord {
  key: string;
  loadCount: number;
}

class TestCacheLoader implements ILoadingCacheLoader<TestKey, TestRecord> {
  private _keyToLoadCountMap = new Map<string, number>();

  load$(
    key: TestKey,
  ): Observable<ILoadResult<TestRecord>> {
    if (key.shouldThrowError) {
      return throwError(new Error());
    }

    return timer(loadTime).pipe(
      map(() => {
        if (!this._keyToLoadCountMap.has(key.key)) {
          this._keyToLoadCountMap.set(key.key, 0);
        }
        this._keyToLoadCountMap.set(
          key.key,
          this._keyToLoadCountMap.get(key.key) + 1,
        );

        return {
          timestamp: Date.now(),
          value: {
            key: key.key,
            loadCount: this._keyToLoadCountMap.get(key.key),
          },
        };
      }),
      first(),
    );
  }

  store$(key: TestKey, value: TestRecord): Observable<ILoadResult<TestRecord>> {
    return of(null);
  }
}

describe('LoadingCache', () => {
  let loadingCache: LoadingCache<TestKey, TestRecord>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    loadingCache = new LoadingCache({
      cacheLoader: new TestCacheLoader,
      refreshTime,
      spoilTime,
      timeout,
    });
  });

  it('getShouldHaveOnlyOneSimultaneousLoad', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(record => {
            expect(record.key).toBe(key.key);
            expect(record.loadCount).toBe(1);
          }),
        );
      }),
    ).subscribe(done);
  });

  it('getCallsDuringLoadShouldCompleteSimultaneously', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const timestampList: Array<number> = [];

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(record => {
            timestampList.push(Date.now());
            expect(record.key).toBe(key.key);
            expect(record.loadCount).toBe(1);
          }),
        );
      }),
    ).subscribe(() => {
      expect(Math.max(...timestampList) - Math.min(...timestampList)).toBeLessThanOrEqual(allowedInstantTimeDifference);
      done();
    });
  });
});
