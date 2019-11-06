// Simple tests are to test automatized/randomized tests
// todo write automatized/randomized tests

import {AsyncReadWriteLock} from './async-read-write-lock';

describe('AsyncReadWriteLock', () => {
  const accessNameMap = {
    rf1: 'ReadFinish1',
    rf2: 'ReadFinish2',
    rf3: 'ReadFinish3',
    rs1: 'ReadStart1',
    rs2: 'ReadStart2',
    rs3: 'ReadStart3',
    wf1: 'WriteFinish1',
    wf2: 'WriteFinish2',
    wf3: 'WriteFinish3',
    ws1: 'WriteStart1',
    ws2: 'WriteStart2',
    ws3: 'WriteStart3',
  };
  const allowedTimeDifference = 5;
  let logList: string[];
  let lock: AsyncReadWriteLock;
  let startTime: number;
  const timeList = [
    30,
    20,
    10,
    // Sorting to make logic work with any numbers and enforce descending order
  ].sort((a, b) => a - b).reverse();

  beforeEach(() => {
    logList = [];
    lock = new AsyncReadWriteLock();

    startTime = performance.now();
  });

  it('simpleTestRRR', (done: DoneFn) => {
    const promiseList = [
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs1);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf1);
            resolve();
          }, timeList[0]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs2);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf2);
            resolve();
          }, timeList[1]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs3);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf3);
            resolve();
          }, timeList[2]);
        }));
      }),
    ];
    Promise.all(promiseList).then(() => {
      const finishTime = performance.now();

      const expectedTimePassed = Math.max(...timeList);
      const timePassed = finishTime - startTime;
      expect(
        expectedTimePassed < timePassed &&
        timePassed < expectedTimePassed + allowedTimeDifference).toBeTruthy();

      expect(logList).toEqual([
        accessNameMap.rs3,
        accessNameMap.rf3,
        accessNameMap.rs2,
        accessNameMap.rf2,
        accessNameMap.rs1,
        accessNameMap.rf1,
      ]);
      done();
    });
  });

  it('simpleTestWRR', (done: DoneFn) => {
    const promiseList = [
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws1);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf1);
            resolve();
          }, timeList[0]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs2);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf2);
            resolve();
          }, timeList[1]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs3);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf3);
            resolve();
          }, timeList[2]);
        }));
      }),
    ];
    Promise.all(promiseList).then(() => {
      const finishTime = performance.now();

      const expectedTimePassed = Math.max(timeList[0] + Math.max(...timeList.slice(1)));
      const timePassed = finishTime - startTime;
      expect(expectedTimePassed < timePassed && timePassed < expectedTimePassed + allowedTimeDifference).toBeTruthy();

      expect(logList).toEqual([
        accessNameMap.ws1,
        accessNameMap.wf1,
        accessNameMap.rs3,
        accessNameMap.rf3,
        accessNameMap.rs2,
        accessNameMap.rf2,
      ]);
      done();
    });
  });

  it('simpleTestRWR', (done: DoneFn) => {
    const promiseList = [
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs1);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf1);
            resolve();
          }, timeList[0]);
        }));
      }),
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws2);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf2);
            resolve();
          }, timeList[1]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs3);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf3);
            resolve();
          }, timeList[2]);
        }));
      }),
    ];
    Promise.all(promiseList).then(() => {
      const finishTime = performance.now();

      const expectedTimePassed = timeList.reduce((acc, time) => acc + time, 0);
      const timePassed = finishTime - startTime;
      expect(expectedTimePassed < timePassed && timePassed < expectedTimePassed + allowedTimeDifference).toBeTruthy();

      expect(logList).toEqual([
        accessNameMap.rs1,
        accessNameMap.rf1,
        accessNameMap.ws2,
        accessNameMap.wf2,
        accessNameMap.rs3,
        accessNameMap.rf3,
      ]);
      done();
    });
  });

  it('simpleTestRRW', (done: DoneFn) => {
    const promiseList = [
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs1);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf1);
            resolve();
          }, timeList[0]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs2);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf2);
            resolve();
          }, timeList[1]);
        }));
      }),
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws3);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf3);
            resolve();
          }, timeList[2]);
        }));
      }),
    ];
    Promise.all(promiseList).then(() => {
      const finishTime = performance.now();

      const expectedTimePassed = Math.max(timeList[0], timeList[1]) + timeList[2];
      const timePassed = finishTime - startTime;
      expect(expectedTimePassed < timePassed && timePassed < expectedTimePassed + allowedTimeDifference).toBeTruthy();

      expect(logList).toEqual([
        accessNameMap.rs2,
        accessNameMap.rf2,
        accessNameMap.rs1,
        accessNameMap.rf1,
        accessNameMap.ws3,
        accessNameMap.wf3,
      ]);
      done();
    });
  });
  it('simpleTestRWW', (done: DoneFn) => {
    const promiseList = [
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs1);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf1);
            resolve();
          }, timeList[0]);
        }));
      }),
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws2);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf2);
            resolve();
          }, timeList[1]);
        }));
      }),
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws3);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf3);
            resolve();
          }, timeList[2]);
        }));
      }),
    ];
    Promise.all(promiseList).then(() => {
      const finishTime = performance.now();

      const expectedTimePassed = timeList.reduce((acc, time) => acc + time, 0);
      const timePassed = finishTime - startTime;
      expect(expectedTimePassed < timePassed && timePassed < expectedTimePassed + allowedTimeDifference).toBeTruthy();

      expect(logList).toEqual([
        accessNameMap.rs1,
        accessNameMap.rf1,
        accessNameMap.ws2,
        accessNameMap.wf2,
        accessNameMap.ws3,
        accessNameMap.wf3,
      ]);
      done();
    });
  });
  it('simpleTestWRW', (done: DoneFn) => {
    const promiseList = [
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws1);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf1);
            resolve();
          }, timeList[0]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs2);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf2);
            resolve();
          }, timeList[1]);
        }));
      }),
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws3);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf3);
            resolve();
          }, timeList[2]);
        }));
      }),
    ];
    Promise.all(promiseList).then(() => {
      const finishTime = performance.now();

      const expectedTimePassed = timeList.reduce((acc, time) => acc + time, 0);
      const timePassed = finishTime - startTime;
      expect(expectedTimePassed < timePassed && timePassed < expectedTimePassed + allowedTimeDifference).toBeTruthy();

      expect(logList).toEqual([
        accessNameMap.ws1,
        accessNameMap.wf1,
        accessNameMap.rs2,
        accessNameMap.rf2,
        accessNameMap.ws3,
        accessNameMap.wf3,
      ]);
      done();
    });
  });
  it('simpleTestWWR', (done: DoneFn) => {
    const promiseList = [
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws1);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf1);
            resolve();
          }, timeList[0]);
        }));
      }),
      lock.acquireWriteLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.ws2);
            lock.releaseWriteLock();
            logList.push(accessNameMap.wf2);
            resolve();
          }, timeList[1]);
        }));
      }),
      lock.acquireReadLock().then(() => {
        return new Promise(((resolve, reject) => {
          setTimeout(() => {
            logList.push(accessNameMap.rs3);
            lock.releaseReadLock();
            logList.push(accessNameMap.rf3);
            resolve();
          }, timeList[2]);
        }));
      }),
    ];
    Promise.all(promiseList).then(() => {
      const finishTime = performance.now();

      const expectedTimePassed = timeList.reduce((acc, time) => acc + time, 0);
      const timePassed = finishTime - startTime;
      expect(expectedTimePassed < timePassed && timePassed < expectedTimePassed + allowedTimeDifference).toBeTruthy();

      expect(logList).toEqual([
        accessNameMap.ws1,
        accessNameMap.wf1,
        accessNameMap.ws2,
        accessNameMap.wf2,
        accessNameMap.rs3,
        accessNameMap.rf3,
      ]);
      done();
    });
  });
  it('simpleTestWWW', (done: DoneFn) => {
    done();
  });
});
