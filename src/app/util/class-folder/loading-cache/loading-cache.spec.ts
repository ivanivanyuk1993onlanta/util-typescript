import {LoadingCache} from './loading-cache';
import {forkJoin, Observable, of, throwError, TimeoutError, timer} from 'rxjs';
import {catchError, first, flatMap, map, mergeMap, tap} from 'rxjs/operators';
import {ILoadResult} from './i-load-result';
import {ILoadingCacheLoader} from './i-loading-cache-loader';

const allowedApproximateTimeDifference = 10;
const loadTime = 50;
const refreshTime = 100;
const spoilTime = 1000;
const timeout = 200;

function isCurrentTimestampApproximatelyEqualTo(
  timestamp: number,
): boolean {
  const currentTimestamp = Date.now();
  return timestamp - allowedApproximateTimeDifference <= currentTimestamp
    && currentTimestamp <= timestamp + allowedApproximateTimeDifference;
}

interface TestKey {
  key: string;
  loadActualTimestamp?: number;
  loadErrorTime?: number;
  loadTime?: number;
  shouldLoadThrowError?: boolean;
  shouldStoreThrowError?: boolean;
  storeActualTimestamp?: number;
  storeTime?: number;
}

interface TestRecord {
  key: string;
  lastStoredValue: TestRecord;
  loadCount: number;
  storeCount: number;
}

class TestCacheLoader implements ILoadingCacheLoader<TestKey, TestRecord> {
  private _keyToLastStoredValueMap = new Map<string, TestRecord>();
  private _keyToLoadCountMap = new Map<string, number>();
  private _keyToStoreCountMap = new Map<string, number>();

  load$(
    key: TestKey,
  ): Observable<ILoadResult<TestRecord>> {
    if (key.shouldLoadThrowError) {
      return timer(key.loadErrorTime || 0).pipe(
        mergeMap(() => {
          return throwError(new Error(key.key));
        }),
      );
    } else {
      return timer(key.loadTime || loadTime).pipe(
        map(() => {
          if (!this._keyToLoadCountMap.has(key.key)) {
            this._keyToLastStoredValueMap.set(key.key, null);
            this._keyToLoadCountMap.set(key.key, 0);
            this._keyToStoreCountMap.set(key.key, 0);
          }
          this._keyToLoadCountMap.set(
            key.key,
            this._keyToLoadCountMap.get(key.key) + 1,
          );

          return {
            timestamp: key.loadActualTimestamp || Date.now(),
            value: {
              key: key.key,
              lastStoredValue: this._keyToLastStoredValueMap.get(key.key),
              loadCount: this._keyToLoadCountMap.get(key.key),
              storeCount: this._keyToStoreCountMap.get(key.key),
            },
          };
        }),
        first(),
      );
    }
  }

  store$(key: TestKey, value: TestRecord): Observable<ILoadResult<TestRecord>> {
    if (key.shouldStoreThrowError) {
      return throwError(new Error(key.key));
    } else {
      return timer(key.storeTime || loadTime).pipe(
        map(() => {
          if (!this._keyToLoadCountMap.has(key.key)) {
            this._keyToLastStoredValueMap.set(key.key, null);
            this._keyToLoadCountMap.set(key.key, 0);
            this._keyToStoreCountMap.set(key.key, 0);
          }
          this._keyToStoreCountMap.set(
            key.key,
            this._keyToStoreCountMap.get(key.key) + 1,
          );
          this._keyToLastStoredValueMap.set(
            key.key,
            value,
          );

          return {
            timestamp: key.storeActualTimestamp || Date.now(),
            value: {
              key: key.key,
              lastStoredValue: this._keyToLastStoredValueMap.get(key.key),
              loadCount: this._keyToLoadCountMap.get(key.key),
              storeCount: this._keyToStoreCountMap.get(key.key),
            }
          };
        }),
        first(),
      );
    }
  }
}

describe('LoadingCache', () => {
  let loadingCache: LoadingCache<TestKey, TestRecord>;

  beforeEach(() => {
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

    const expectedLoadFinishTimestamp = Date.now() + loadTime;

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(record => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();

            expect(record.key).toBe(key.key);
            expect(record.lastStoredValue).toBe(null);
            expect(record.loadCount).toBe(1);
            expect(record.storeCount).toBe(0);
          }),
        );
      }),
    ).subscribe(done);
  });

  it('getCallsShouldReturnNotSpoiledRecordsImmediately', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    loadingCache.get$(key).subscribe(() => {
      const expectedLoadFinishTimestamp = Date.now();

      forkJoin(
        Array.from(new Array(10)).map(() => {
          return loadingCache.get$(key).pipe(
            tap(recordLocal => {
              expect(recordLocal.key).toBe(key.key);
              expect(recordLocal.lastStoredValue).toBe(null);
              expect(recordLocal.loadCount).toBe(1);
              expect(recordLocal.storeCount).toBe(0);

              expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
            }),
          );
        }),
      ).subscribe(() => {
        done();
      });
    });
  });

  it('getCallsDuringLoadShouldCompleteImmediatelyAfterLoad', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const expectedLoadFinishTimestamp = Date.now() + loadTime;

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(record => {
            expect(record.key).toBe(key.key);
            expect(record.lastStoredValue).toBe(null);
            expect(record.loadCount).toBe(1);
            expect(record.storeCount).toBe(0);

            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
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
      shouldLoadThrowError: true,
    };

    const expectedLoadFinishTimestamp = Date.now();

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
        expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();

        expect(error instanceof Error).toBe(true);
        expect(error.message).toBe(key.key);
      }
      done();
    });
  });

  it('getCallsDuringLoadWithErrorShouldCompleteImmediatelyAfterLoad', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
      shouldLoadThrowError: true,
    };

    const expectedLoadFinishTimestamp = Date.now();

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          catchError(err => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
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
      done();
    });
  });

  it('getShouldThrowTimeoutError', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
      loadTime: timeout,
    };

    const expectedLoadFinishTimestamp = Date.now() + timeout;

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          catchError(error => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
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

  it('getCallsShouldThrowTimeoutErrorImmediatelyAfterTimeout', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
      loadTime: timeout,
    };

    const expectedLoadFinishTimestamp = Date.now() + timeout;

    forkJoin(
      Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          catchError(err => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
            return of(err);
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

  it('getShouldNotHandleLoadResultWhenRecordIsUpdatedFromStore', (done: DoneFn) => {
    const storeTime = 1; // not 0 because key.storeTime || loadTime === loadTime
    const key: TestKey = {
      key: Math.random().toString(),
      storeTime,
    };

    const storeRecord: TestRecord = {
      key: `storeResult:${key.key}`,
      lastStoredValue: null,
      loadCount: 100,
      storeCount: 100,
    };
    storeRecord.lastStoredValue = storeRecord;

    const expectedLoadFinishTimestamp = Date.now() + storeTime;

    forkJoin(
      ...Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(() => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
          }),
        );
      }),
      loadingCache.set$(key, storeRecord),
    ).subscribe((resultList) => {
      for (const result of resultList) {
        expect(result.key).toBe(key.key);
        expect(result.lastStoredValue).toBe(storeRecord);
        expect(result.loadCount).toBe(0);
        expect(result.storeCount).toBe(1);
      }
      done();
    });
  });

  it('getShouldNotHandleLoadErrorWhenRecordIsUpdatedFromStore', (done: DoneFn) => {
    const storeTime = 1; // not 0 because key.storeTime || loadTime === loadTime
    const key: TestKey = {
      key: Math.random().toString(),
      loadErrorTime: loadTime,
      shouldLoadThrowError: true,
      storeTime,
    };

    const storeRecord = {
      key: `storeResult:${key.key}`,
      lastStoredValue: null,
      loadCount: 100,
      storeCount: 100,
    };

    const expectedLoadFinishTimestamp = Date.now() + storeTime;

    forkJoin(
      ...Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(() => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
          }),
        );
      }),
      loadingCache.set$(key, storeRecord),
    ).subscribe((resultList) => {
      for (const result of resultList) {
        expect(result.key).toBe(key.key);
        expect(result.lastStoredValue).toBe(storeRecord);
        expect(result.loadCount).toBe(0);
        expect(result.storeCount).toBe(1);
      }
      done();
    });
  });

  it('getShouldHandleLoadResultWhenRecordIsNotUpdatedFromStore', (done: DoneFn) => {
    const storeTime = 1; // not 0 because key.storeTime || loadTime === loadTime
    const key: TestKey = {
      key: Math.random().toString(),
      shouldStoreThrowError: true,
      storeTime,
    };

    const storeRecord: TestRecord = {
      key: `storeResult:${key.key}`,
      lastStoredValue: null,
      loadCount: 100,
      storeCount: 100,
    };
    storeRecord.lastStoredValue = storeRecord;

    const expectedLoadFinishTimestamp = Date.now() + loadTime;
    const expectedStoreFinishTimestamp = Date.now() + storeTime;

    forkJoin(
      ...Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          tap(() => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
          }),
        );
      }),
      loadingCache.set$(key, storeRecord).pipe(
        catchError(err => {
          expect(isCurrentTimestampApproximatelyEqualTo(expectedStoreFinishTimestamp)).toBeTruthy();
          return of(err);
        }),
      ),
    ).subscribe((resultList) => {
      const storeResult = resultList.pop();
      expect(storeResult instanceof Error).toBe(true);
      expect(storeResult.message).toBe(key.key);
      for (const result of resultList) {
        expect(result.key).toBe(key.key);
        expect(result.lastStoredValue).toBe(null);
        expect(result.loadCount).toBe(1);
        expect(result.storeCount).toBe(0);
      }
      done();
    });
  });

  it('getShouldHandleLoadErrorWhenRecordIsNotUpdatedFromStore', (done: DoneFn) => {
    const storeTime = 1; // not 0 because key.storeTime || loadTime === loadTime
    const key: TestKey = {
      key: Math.random().toString(),
      loadErrorTime: loadTime,
      shouldLoadThrowError: true,
      shouldStoreThrowError: true,
      storeTime,
    };

    const storeRecord: TestRecord = {
      key: `storeResult:${key.key}`,
      lastStoredValue: null,
      loadCount: 100,
      storeCount: 100,
    };
    storeRecord.lastStoredValue = storeRecord;

    const expectedLoadFinishTimestamp = Date.now() + loadTime;
    const expectedStoreFinishTimestamp = Date.now() + storeTime;

    forkJoin(
      ...Array.from(new Array(10)).map(() => {
        return loadingCache.get$(key).pipe(
          catchError(err => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();
            return of(err);
          }),
        );
      }),
      loadingCache.set$(key, storeRecord).pipe(
        catchError(err => {
          expect(isCurrentTimestampApproximatelyEqualTo(expectedStoreFinishTimestamp)).toBeTruthy();
          return of(err);
        }),
      ),
    ).subscribe((resultList) => {
      const storeResult = resultList.pop();
      expect(storeResult instanceof Error).toBe(true);
      expect(storeResult.message).toBe(key.key);
      for (const result of resultList) {
        expect(result instanceof Error).toBe(true);
        expect(result.message).toBe(key.key);
      }
      done();
    });
  });

  it('spoiledRecordsShouldWaitForLoad', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const expectedLoadFinishTimestampList = [Date.now() + loadTime];

    loadingCache.get$(key).subscribe((record) => {
      expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[0])).toBeTruthy();

      expect(record.key).toBe(key.key);
      expect(record.lastStoredValue).toBe(null);
      expect(record.loadCount).toBe(1);
      expect(record.storeCount).toBe(0);

      timer(spoilTime).pipe(
        first(),
      ).subscribe(() => {
        expectedLoadFinishTimestampList.push(Date.now() + loadTime);
        forkJoin(
          Array.from(new Array(10)).map(() => {
            return loadingCache.get$(key).pipe(
              tap(recordLocal => {
                expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[1])).toBeTruthy();

                expect(recordLocal.key).toBe(key.key);
                expect(recordLocal.lastStoredValue).toBe(null);
                expect(recordLocal.loadCount).toBe(2);
                expect(recordLocal.storeCount).toBe(0);
              }),
            );
          }),
        ).subscribe(() => {
          done();
        });
      });
    });
  });

  it('notSpoiledRecordsShouldReturnImmediately', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const expectedLoadFinishTimestampList = [Date.now() + loadTime];

    loadingCache.get$(key).subscribe((record) => {
      expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[0])).toBeTruthy();

      expect(record.key).toBe(key.key);
      expect(record.lastStoredValue).toBe(null);
      expect(record.loadCount).toBe(1);
      expect(record.storeCount).toBe(0);

      expectedLoadFinishTimestampList.push(Date.now());
      forkJoin(
        Array.from(new Array(10)).map(() => {
          return loadingCache.get$(key).pipe(
            tap(recordLocal => {
              expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[1])).toBeTruthy();

              expect(recordLocal.key).toBe(key.key);
              expect(recordLocal.lastStoredValue).toBe(null);
              expect(recordLocal.loadCount).toBe(1);
              expect(recordLocal.storeCount).toBe(0);
            }),
          );
        }),
      ).subscribe(() => {
        done();
      });
    });
  });

  it('afterRefreshTimeLoadShouldBeInitiated', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const expectedLoadFinishTimestampList = [Date.now() + loadTime];

    loadingCache.get$(key).subscribe((record) => {
      expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[0])).toBeTruthy();

      expect(record.key).toBe(key.key);
      expect(record.lastStoredValue).toBe(null);
      expect(record.loadCount).toBe(1);
      expect(record.storeCount).toBe(0);

      timer(refreshTime + allowedApproximateTimeDifference).pipe(
        first(),
      ).subscribe(() => {
        expectedLoadFinishTimestampList.push(Date.now());
        forkJoin(
          Array.from(new Array(10)).map(() => {
            return loadingCache.get$(key).pipe(
              tap(recordLocal => {
                expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[1])).toBeTruthy();

                expect(recordLocal.key).toBe(key.key);
                expect(recordLocal.lastStoredValue).toBe(null);
                expect(recordLocal.loadCount).toBe(1);
                expect(recordLocal.storeCount).toBe(0);
              }),
            );
          }),
        ).subscribe();

        timer(loadTime).pipe(
          first(),
        ).subscribe(() => {
          expectedLoadFinishTimestampList.push(Date.now());
          forkJoin(
            Array.from(new Array(10)).map(() => {
              return loadingCache.get$(key).pipe(
                tap(recordLocal => {
                  expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[2])).toBeTruthy();

                  expect(recordLocal.key).toBe(key.key);
                  expect(recordLocal.lastStoredValue).toBe(null);
                  expect(recordLocal.loadCount).toBe(2);
                  expect(recordLocal.storeCount).toBe(0);
                }),
              );
            }),
          ).subscribe(done);
        });
      });
    });
  });

  it('beforeRefreshTimeLoadShouldNotBeInitiated', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const expectedLoadFinishTimestampList = [Date.now() + loadTime];

    loadingCache.get$(key).subscribe((record) => {
      expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[0])).toBeTruthy();

      expect(record.key).toBe(key.key);
      expect(record.lastStoredValue).toBe(null);
      expect(record.loadCount).toBe(1);
      expect(record.storeCount).toBe(0);

      timer(refreshTime - allowedApproximateTimeDifference).pipe(
        first(),
      ).subscribe(() => {
        expectedLoadFinishTimestampList.push(Date.now());
        forkJoin(
          Array.from(new Array(10)).map(() => {
            return loadingCache.get$(key).pipe(
              tap(recordLocal => {
                expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[1])).toBeTruthy();

                expect(recordLocal.key).toBe(key.key);
                expect(recordLocal.lastStoredValue).toBe(null);
                expect(recordLocal.loadCount).toBe(1);
                expect(recordLocal.storeCount).toBe(0);
              }),
            );
          }),
        ).subscribe();

        timer(loadTime).pipe(
          first(),
        ).subscribe(() => {
          expectedLoadFinishTimestampList.push(Date.now());
          forkJoin(
            Array.from(new Array(10)).map(() => {
              return loadingCache.get$(key).pipe(
                tap(recordLocal => {
                  expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[2])).toBeTruthy();

                  expect(recordLocal.key).toBe(key.key);
                  expect(recordLocal.lastStoredValue).toBe(null);
                  expect(recordLocal.loadCount).toBe(1);
                  expect(recordLocal.storeCount).toBe(0);
                }),
              );
            }),
          ).subscribe(done);
        });
      });
    });
  });

  it('actualLoadResultShouldUpdateRecord', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const expectedLoadFinishTimestampList = [Date.now() + loadTime];

    loadingCache.get$(key).subscribe(recordLocal => {
      expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[0])).toBeTruthy();

      expect(recordLocal.key).toBe(key.key);
      expect(recordLocal.lastStoredValue).toBe(null);
      expect(recordLocal.loadCount).toBe(1);
      expect(recordLocal.storeCount).toBe(0);

      timer(refreshTime).pipe(
        first(),
      ).subscribe(() => {
        expectedLoadFinishTimestampList.push(Date.now());
        loadingCache.get$(key).pipe(
          tap(recordLocal2 => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[1])).toBeTruthy();

            expect(recordLocal2.key).toBe(key.key);
            expect(recordLocal2.lastStoredValue).toBe(null);
            expect(recordLocal2.loadCount).toBe(1);
            expect(recordLocal2.storeCount).toBe(0);
          }),
        ).subscribe(() => {
          timer(loadTime + allowedApproximateTimeDifference).pipe(
            first(),
          ).subscribe(() => {
            expectedLoadFinishTimestampList.push(Date.now());
            loadingCache.get$(key).pipe(
              tap(recordLocal2 => {
                expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[2])).toBeTruthy();

                expect(recordLocal2.key).toBe(key.key);
                expect(recordLocal2.lastStoredValue).toBe(null);
                expect(recordLocal2.loadCount).toBe(2);
                expect(recordLocal2.storeCount).toBe(0);
              }),
            ).subscribe(done);
          });
        });
      });
    });
  });

  it('notActualLoadResultShouldNotUpdateRecord', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
    };

    const expectedLoadFinishTimestampList = [Date.now() + loadTime];

    loadingCache.get$(key).subscribe(recordLocal => {
      expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[0])).toBeTruthy();

      expect(recordLocal.key).toBe(key.key);
      expect(recordLocal.lastStoredValue).toBe(null);
      expect(recordLocal.loadCount).toBe(1);
      expect(recordLocal.storeCount).toBe(0);

      timer(refreshTime).pipe(
        first(),
      ).subscribe(() => {
        expectedLoadFinishTimestampList.push(Date.now());
        key.loadActualTimestamp = 1;
        loadingCache.get$(key).pipe(
          tap(recordLocal2 => {
            expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[1])).toBeTruthy();

            expect(recordLocal2.key).toBe(key.key);
            expect(recordLocal2.lastStoredValue).toBe(null);
            expect(recordLocal2.loadCount).toBe(1);
            expect(recordLocal2.storeCount).toBe(0);
          }),
        ).subscribe(() => {
          timer(loadTime + allowedApproximateTimeDifference).pipe(
            first(),
          ).subscribe(() => {
            expectedLoadFinishTimestampList.push(Date.now());
            delete key.loadActualTimestamp;
            loadingCache.get$(key).pipe(
              tap(recordLocal2 => {
                expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestampList[2])).toBeTruthy();

                expect(recordLocal2.key).toBe(key.key);
                expect(recordLocal2.lastStoredValue).toBe(null);
                expect(recordLocal2.loadCount).toBe(1);
                expect(recordLocal2.storeCount).toBe(0);
              }),
            ).subscribe(done);
          });
        });
      });
    });
  });

  it('eachStoreShouldGetOnlyItsResult', (done: DoneFn) => {
    const key: TestKey = {
      key: Math.random().toString(),
      loadTime: loadTime / 2,
      storeTime: loadTime,
    };

    const expectedLoadFinishTimestamp = Date.now() + key.loadTime;
    const expectedStoreFinishTimestampList = [];

    forkJoin(
      loadingCache.get$(key).pipe(
        tap(record => {
          expect(isCurrentTimestampApproximatelyEqualTo(expectedLoadFinishTimestamp)).toBeTruthy();

          expect(record.key).toBe(key.key);
          expect(record.lastStoredValue).toBe(null);
          expect(record.loadCount).toBe(1);
          expect(record.storeCount).toBe(0);
        }),
      ),
      ...Array.from((new Array(10)).keys()).map((index) => {
        return timer(index * allowedApproximateTimeDifference).pipe(
          first(),
          flatMap(() => {
            expectedStoreFinishTimestampList.push(Date.now() + key.storeTime);
            return loadingCache.set$(key, null).pipe(
              tap(record => {
                expect(isCurrentTimestampApproximatelyEqualTo(expectedStoreFinishTimestampList[index])).toBeTruthy();

                expect(record.key).toBe(key.key);
                expect(record.lastStoredValue).toBe(null);
                expect(record.loadCount).toBe(1);
                expect(record.storeCount).toBe(index + 1);
              }),
            );
          }),
        );
      })
    ).subscribe(done);
  });
});
