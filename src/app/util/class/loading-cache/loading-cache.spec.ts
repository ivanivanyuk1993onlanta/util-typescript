import {LoadingCache} from './loading-cache';
import {forkJoin, Observable, of, throwError, TimeoutError, timer} from 'rxjs';
import {catchError, first, map, tap} from 'rxjs/operators';
import {ILoadResult} from './i-load-result';
import {ILoadingCacheLoader} from './i-loading-cache-loader';
import {TestBed} from '@angular/core/testing';

const allowedInstantTimeDifference = 10;
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
      return throwError(new Error(key.key));
    } else {
      return timer(key.loadTime || loadTime).pipe(
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

  it('getCallsDuringLoadShouldCompleteImmediatelyAfterLoad', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const timestamp = Date.now();
    const expectedLoadFinishTimestamp = timestamp + loadTime + allowedInstantTimeDifference;

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(record => {
            expect(record.key).toBe(key.key);
            expect(record.loadCount).toBe(1);
            expect(Date.now()).toBeLessThanOrEqual(expectedLoadFinishTimestamp);
          }),
        );
      }),
    ).subscribe(() => {
      done();
    });
  });

  it('getShouldHandleError', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
      shouldThrowError: true,
    };

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          catchError(error => {
            return of(error);
          }),
        );
      }),
    ).subscribe((errorList) => {
      expect(Array.isArray(errorList)).toBe(true);
      for (const error of errorList) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toBe(key.key);
      }
      done();
    });
  });

  it('getCallsDuringLoadWithErrorShouldCompleteSimultaneously', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
      shouldThrowError: true,
    };

    const timestampList: Array<number> = [];

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          catchError(err => {
            timestampList.push(Date.now());
            return of(err);
          }),
        );
      }),
    ).subscribe((errorList) => {
      expect(Array.isArray(errorList)).toBe(true);
      for (const error of errorList) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toBe(key.key);
      }
      expect(Math.max(...timestampList) - Math.min(...timestampList)).toBeLessThanOrEqual(allowedInstantTimeDifference);
      done();
    });
  });

  it('getShouldThrowTimeoutError', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
      loadTime: timeout,
    };

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          catchError(error => {
            return of(error);
          }),
        );
      }),
    ).subscribe((errorList) => {
      expect(Array.isArray(errorList)).toBe(true);
      for (const error of errorList) {
        expect(error instanceof TimeoutError).toBe(true);
      }
      done();
    });
  });
});
