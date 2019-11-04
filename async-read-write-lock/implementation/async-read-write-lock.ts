import {AsyncReadWriteLockInterface} from '../async-read-write-lock-interface';
import {LinkedList} from 'linked-list-typescript';

const writerLockNumber = 0;

export class AsyncReadWriteLock implements AsyncReadWriteLockInterface {
  // This list holds locked reader counts, or writerLockNumber-s for writer locks
  private _readLockCountList = new LinkedList<number | typeof writerLockNumber>();
  // This list holds functions, which resolve Promises, returned by acquireLock
  private _lockReleaserList = new LinkedList<() => void>();
  // _lastReadAcquirePromise is needed to reuse Promise for new readers
  private _lastReadAcquirePromise: Promise<void>;

  acquireReadLock(): Promise<void> {
    if (this._readLockCountList.length !== 0) {
      const readerCount = this._readLockCountList.tail;
      if (readerCount !== writerLockNumber) {
        // Last lock is reader lock, hence we should increment it's read lock
        // count
        this._incrementReadLockCountListTail();
      } else {
        // Last lock is writer lock, hence we should run _appendReadLockAfterWriteLock
        this._appendReadLockAfterWriteLock();
      }
    } else {
      // _readLockCountList is empty here, hence we can append 1 to _readLockCountList,
      // append resolved Promise to _readAcquirePromiseList(for reuse in next
      // readers) and we have no need to append _lockReleaserList, as appended
      // to _readAcquirePromiseList Promise is already resolved
      this._readLockCountList.append(1);
      this._lastReadAcquirePromise = Promise.resolve();
    }
    return this._lastReadAcquirePromise;
  }

  acquireWriteLock(): Promise<void> {
    return undefined;
  }

  releaseReadLock() {
    // releaseReadLock should be called only when _readLockCountList has reader
    // count in head, hence we can safely assume that 0 doesn't mean
    // writerLockNumber, but means that we can remove lock and try to call next
    // lock releaser, if it exists
    this._decrementReadLockCountListHead();
    if (this._readLockCountList.head < 1) {
      this._readLockCountList.removeHead();
      if (this._lockReleaserList.length > 0) {
        this._lockReleaserList.removeHead()();
      }
    }
  }

  releaseWriteLock() {
  }

  private _appendReadLockAfterWriteLock() {
    // We need to append Read lock after write lock, hence we need to initialize
    // new _readLockCountList with value 1, append new unresolved
    // readAcquirePromise and it's resolver to lists
    this._readLockCountList.append(1);
    this._lastReadAcquirePromise = new Promise<void>((onFulfilled) => {
      this._lockReleaserList.append(onFulfilled);
    });
  }

  private _decrementReadLockCountListHead() {
    this._readLockCountList.prepend(this._readLockCountList.removeHead() - 1);
  }

  private _incrementReadLockCountListTail() {
    this._readLockCountList.append(this._readLockCountList.removeTail() + 1);
  }
}
