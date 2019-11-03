export interface AsyncReadWriteLockInterface {
  // Method should return Promise, which will be resolved after lock is ready
  // for read operation (no unresolved writers tried to access resource before
  // this reader)
  acquireReadLock(): Promise<void>;

  // Method should return Promise, which will be resolved after lock is ready
  // for write (no unresolved readers/writers tried to access resource before
  // this writer)
  acquireWriteLock(): Promise<void>;

  // Method should run inside read lock release logic
  releaseReadLock();

  // Method should run inside write lock release logic
  releaseWriteLock(): Promise<void>;
}
