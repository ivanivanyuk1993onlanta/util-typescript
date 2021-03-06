import { AsyncReadWriteLockInterface } from "../AsyncReadWriteLockInterface";
import { LinkedList } from "linked-list-typescript";

const writerLockNumber = 0;

export class FairAsyncReadWriteLock implements AsyncReadWriteLockInterface {
  // This list holds locked reader counts, or writerLockNumber-s for writer locks
  private _readLockCountList = new LinkedList<
    number | typeof writerLockNumber
  >();

  // This list holds functions, which resolve Promises, returned by acquireLock
  private _lockReleaserList = new LinkedList<() => void>();
  // _lastReadAcquirePromise is needed to reuse Promise for new readers
  private _lastReadAcquirePromise?: Promise<void>;

  acquireReadLock(): Promise<void> {
    if (this._readLockCountList.length !== 0) {
      if (this._readLockCountList.tail !== writerLockNumber) {
        // Last lock is reader lock, hence we should increment it's read lock
        // count
        this._readLockCountList.append(
          this._readLockCountList.removeTail() + 1
        );
      } else {
        // Last lock is writer lock, hence we need to append Read lock after
        // write lock, hence we need to initialize new _readLockCountList with
        // value 1, create and store new unresolved readAcquirePromise and it's
        // resolver
        this._readLockCountList.append(1);
        this._lastReadAcquirePromise = new Promise<void>(onFulfilled => {
          this._lockReleaserList.append(onFulfilled);
        });
      }
    } else {
      // _readLockCountList is empty here, hence we can append 1 to
      // _readLockCountList, store resolved Promise(for reuse in next readers),
      // we have no need to append _lockReleaserList, as new Promise is
      // already resolved
      this._readLockCountList.append(1);
      this._lastReadAcquirePromise = Promise.resolve();
    }
    return this._lastReadAcquirePromise as Promise<void>;
  }

  acquireWriteLock(): Promise<void> {
    // Write lock, unlike read locks, can not share access with other write
    // locks, it should always append new node to lists
    this._readLockCountList.append(writerLockNumber);
    // Checking for 1 instead of 0, because we added lock in previous line(we
    // don't do it later in if/else block to avoid code duplication)
    if (this._readLockCountList.length !== 1) {
      // We return unresolved Promise, hence we need to append also
      // _lockReleaserList here
      return new Promise<void>(onFulfilled => {
        this._lockReleaserList.append(onFulfilled);
      });
    } else {
      // _readLockCountList is empty here, hence we return resolved Promise,
      // we have no need to append _lockReleaserList, as returned Promise is
      // already resolved
      return Promise.resolve();
    }
  }

  releaseReadLock(): Promise<void> {
    // releaseReadLock should be called only when _readLockCountList has reader
    // count in head, hence we can safely assume that 0 doesn't mean
    // writerLockNumber, but means that we can remove lock and try to call next
    // lock releaser, if it exists
    this._readLockCountList.prepend(this._readLockCountList.removeHead() - 1);
    if (this._readLockCountList.head < 1) {
      this._releaseNextLock();
    }
    return Promise.resolve();
  }

  releaseWriteLock(): Promise<void> {
    // releaseWriteLock should be called only when _readLockCountList has writer
    // number in head, hence we can safely run _releaseNextLock logic
    this._releaseNextLock();
    return Promise.resolve();
  }

  private _releaseNextLock(): void {
    this._readLockCountList.removeHead();
    if (this._lockReleaserList.length > 0) {
      this._lockReleaserList.removeHead()();
    }
  }
}
