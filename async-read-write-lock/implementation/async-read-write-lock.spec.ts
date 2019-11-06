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
  let lock: AsyncReadWriteLock;

  beforeEach(() => {
    lock = new AsyncReadWriteLock();
  });

  // Simple tests are to test automatized/randomized tests
  it('simpleTestRRR', (done: DoneFn) => {
    const promiseList: Promise<void>[] = [];
    const logList: string[] = [];
    promiseList.push(lock.acquireReadLock().then(() => {
      return new Promise(((resolve, reject) => {
        setTimeout(() => {
          logList.push(accessNameMap.rs1);
          lock.releaseReadLock();
          logList.push(accessNameMap.rf1);
          resolve();
        }, 1500);
      }));
    }));
    promiseList.push(lock.acquireReadLock().then(() => {
      return new Promise(((resolve, reject) => {
        setTimeout(() => {
          logList.push(accessNameMap.rs2);
          lock.releaseReadLock();
          logList.push(accessNameMap.rf2);
          resolve();
        }, 1000);
      }));
    }));
    promiseList.push(lock.acquireReadLock().then(() => {
      return new Promise(((resolve, reject) => {
        setTimeout(() => {
          logList.push(accessNameMap.rs3);
          lock.releaseReadLock();
          logList.push(accessNameMap.rf3);
          resolve();
        }, 500);
      }));
    }));
    Promise.all(promiseList).then(() => {
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
    const promiseList: Promise<void>[] = [];
    const logList: string[] = [];
    promiseList.push(lock.acquireWriteLock().then(() => {
      return new Promise(((resolve, reject) => {
        setTimeout(() => {
          logList.push(accessNameMap.ws1);
          lock.releaseWriteLock();
          logList.push(accessNameMap.wf1);
          resolve();
        }, 1500);
      }));
    }));
    promiseList.push(lock.acquireReadLock().then(() => {
      return new Promise(((resolve, reject) => {
        setTimeout(() => {
          logList.push(accessNameMap.rs2);
          lock.releaseReadLock();
          logList.push(accessNameMap.rf2);
          resolve();
        }, 1000);
      }));
    }));
    promiseList.push(lock.acquireReadLock().then(() => {
      return new Promise(((resolve, reject) => {
        setTimeout(() => {
          logList.push(accessNameMap.rs3);
          lock.releaseReadLock();
          logList.push(accessNameMap.rf3);
          resolve();
        }, 500);
      }));
    }));
    Promise.all(promiseList).then(() => {
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
    done();
  });
  it('simpleTestRRW', (done: DoneFn) => {
    done();
  });
  it('simpleTestRWW', (done: DoneFn) => {
    done();
  });
  it('simpleTestWRW', (done: DoneFn) => {
    done();
  });
  it('simpleTestWWR', (done: DoneFn) => {
    done();
  });
  it('simpleTestWWW', (done: DoneFn) => {
    done();
  });
});
