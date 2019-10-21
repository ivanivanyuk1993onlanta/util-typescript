# Loading cache requirements
1. Cache should have CacheLoader<K, V>
   1. Loader should have load$ method, which should return value and actuality timestamp, or throw Error (why - because only DB knows when it sent record, response transfer time is dynamic)
   1. Loader should have store$ method, which should return changed value and actuality timestamp, or throw Error
1. Cache should have get$ method
   1. get$ should return load$ value, or load$ Error, or TimeoutError
   1. get$ should have only one simultaneously active load$ at a time
   1. get$ calls during waiting load$ should subscribe to existing load$ and complete simultaneously
   1. get$ calls with error result should immediately broadcast to all active subscribers (without waiting for timeout)
   1. get$ should have timeout and throw TimeoutError
   1. get$ should init load$, even when active store$ calls exist (why - because they may finish with errors, but get$ is not interested in store$ errors), but should stop waiting, if one of store$ results updates record
1. Cache should have spoil time
   1. When spoil time has come, get$ subscribers should wait for load$ to complete, otherwise latest value should be returned immediately
1. Cache should have refresh time
   1. When it is time to refresh, load$ should be initiated(if it has not already), otherwise refresh part should be skipped (record should be returned immediately or on subscription)
   1. When load$ completes, if load result is actual, record should be updated and pushed to subscribers
1. Cache should have method set$, which should be used for all modifying requests (create, delete, update)
   1. Any quantity of simultaneous set$ requests may be active at a time
   1. set$ calls should subscribe only to their result, ignoring others's results and errors
   1. On set$ result, if it is more actual, record should be updated and pushed to subscribers, otherwise Error should be thrown
   1. set$ should throw TimeoutError

# Required test list
1. getShouldHaveOnlyOneSimultaneousLoad
1. getCallsDuringLoadShouldCompleteImmediatelyAfterLoad
1. getCallsShouldReturnNotSpoiledRecordsImmediately
1. getShouldHandleError
1. getCallsDuringLoadWithErrorShouldCompleteImmediatelyAfterLoad
1. getShouldThrowTimeoutError
1. getCallsShouldThrowTimeoutErrorImmediatelyAfterTimeout
1. getShouldNotHandleLoadResultWhenRecordIsUpdatedFromStore
1. getShouldNotHandleLoadErrorWhenRecordIsUpdatedFromStore
1. getShouldHandleLoadResultWhenRecordIsNotUpdatedFromStore
1. getShouldHandleLoadErrorWhenRecordIsNotUpdatedFromStore
1. spoiledRecordsShouldWaitForLoad
1. notSpoiledRecordsShouldReturnImmediately
1. afterRefreshTimeLoadShouldBeInitiated
1. beforeRefreshTimeLoadShouldNotBeInitiated
1. actualLoadResultShouldUpdateRecord
1. notActualLoadResultShouldNotUpdateRecord
1. eachStoreShouldGetOnlyItsResult
1. setShouldHandleError
1. actualStoreResultShouldUpdateRecord
1. notActualStoreResultShouldThrowError
1. setShouldThrowTimeoutError

# Test scenario info
1. Record state properties that may affect result/time
    1. CompletedLoad/CompletedLoadWithError/CompletedLoadWithTimeoutError
    1. CompletedStore/CompletedStoreWithError/CompletedStoreWithTimeoutError/CompletedStoreWithNotActualError
    1. ForegoingLoad/NotForegoingLoad
    1. ForegoingStore/NotForegoingStore
    1. LoadResult: result/error/timeoutError
    1. LoadTime
    1. NeedingRefresh/NotNeedingRefresh
    1. Spoiled/Unspoiled
    1. StoreResult: result/error/timeoutError/notActualError
    1. StoreTime
    1. Touched/Untouched
