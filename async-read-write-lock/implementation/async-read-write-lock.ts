import {AsyncReadWriteLockInterface} from '../async-read-write-lock-interface';
import {LinkedList} from 'linked-list-typescript';

const writerLockNumber = 0;

export class AsyncReadWriteLock implements AsyncReadWriteLockInterface {
  // This list holds locked reader counts, or writerLockNumber-s for writer locks
  private _heldLockList = new LinkedList<number | typeof writerLockNumber>();
  // This list holds functions, which resolve Promises, returned by acquireLock
  private _lockReleaserList = new LinkedList<() => void>();
  // This list holds promises, which should be used to notify multiple readers
  private _readerLockNotifierList = new LinkedList<Promise<void>>();

  // todo DRY. This code looks very similar, DRY it when more time is available
  //  (also think about returning this._readerLockNotifierList.tail instead of
  //  Promise.resolve())
  acquireReadLock(): Promise<void> {
    if (this._heldLockList.length !== 0) {
      const readerCount = this._heldLockList.tail;
      if (this._heldLockList.length !== 1) {
        if (readerCount !== writerLockNumber) {
          // Last lock is reader lock, hence we can increment it's reader count
          // and return last Promise from _readerLockNotifierList
          this._heldLockList.append(this._heldLockList.removeTail() + 1);
          return this._readerLockNotifierList.tail;
        } else {
          // Last lock is writer lock, hence we should append 1 to
          // _heldLockList, create promise with resolver, push resolver to
          // _lockReleaserList and Promise to _readerLockNotifierList(to reuse
          // Promise in next readers), then return Promise
          this._heldLockList.append(1);
          const readerLockNotifier = new Promise<void>((onFulfilled) => {
            this._lockReleaserList.append(onFulfilled);
          });
          this._readerLockNotifierList.append(readerLockNotifier);
          return readerLockNotifier;
        }
      } else {
        if (readerCount !== writerLockNumber) {
          // We have exactly one reader lock here, hence we can increment it's
          // reader count and resolve immediately
          this._heldLockList.append(this._heldLockList.removeTail() + 1);
          return Promise.resolve();
        } else {
          // We have exactly one writer lock here, hence we should append 1 to
          // _heldLockList, create promise with resolver, push resolver to
          // _lockReleaserList and Promise to _readerLockNotifierList(to reuse
          // Promise in next readers), then return Promise
          this._heldLockList.append(1);
          const readerLockNotifier = new Promise<void>((onFulfilled) => {
            this._lockReleaserList.append(onFulfilled);
          });
          this._readerLockNotifierList.append(readerLockNotifier);
          return readerLockNotifier;
        }
      }
    } else {
      // _heldLockList is empty here, hence we can append 1 to _heldLockList and
      // resolve Promise lock immediately
      this._heldLockList.append(1);
      return Promise.resolve();
    }
  }

  acquireWriteLock(): Promise<void> {
    return undefined;
  }

  releaseReadLock() {
  }

  releaseWriteLock() {
  }
}
