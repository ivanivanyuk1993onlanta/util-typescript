# Loading cache requirements
1. Cache should have only 1 active load$, initialised by get$ at a time
1. Cache should have spoil time. When spoil time is passed, get$ subscribers should wait for load$ to complete. If load$ is in progress and not timed out, new get$ subscribers should not init new load$, but wait for existing one
1. Cache should have refresh time. When it is time to refresh, load$ should be initiated, on load$ complete record should be updated. Refresh time should not be considered when deciding to wait or return record, it is the function of spoil time
1. Cache should handle get$ errors, all subscribers should receive error immediately, without waiting for timeout.
1. Cache should have timeout with error
1. Cache should have method set$, which should be used for all modifying requests (create, delete, update).
1. Any amount of simultaneous set$ requests may be active at a time.
1. All set$ calls should subscribe only to their own result. On result receive, they should update record, if result is more actual
1. set$ should return set$ result, if it is more actual than current record, otherwise error should be returned
1. Timestamp actuality should be returned from load$, set$ functions, as only DB can know for sure what timestamp record has when it is sent from DB
1. Errors should not update record timestamp
# TDD test list
1. getShouldHaveOnlyOneSimultaneousLoad
1. getShouldWaitForLoadCompletionWhenSpoiled
1. getShouldReturnLastActualRecordImmediatelyWhenNotSpoiled
1. getShouldInitLoadWhenRefreshTimeHasCome
1. getShouldNotInitLoadWhenRefreshTimeHasNotCome
1. getShouldHandleError
1. getShouldHandleErrorNotWaitingForTimeout
1. getShouldHandleTimeoutError
1. setShouldHaveAnyAmountOfSimultaneousCalls
1. getResultsShouldNotAffectSetSubscribers
1. setResultsShouldNotAffectOtherSetSubscribers
1. setResultShouldUpdateRecordIfResultIsActual
1. setResultShouldNotUpdateRecordIfResultIsNotActual
1. setShouldResultInErrorWhenResultIsNotActual
1. setShouldHaveTimeoutWithError
1. setShouldHandleError
1. getLoadShouldFinishOnUpdateFromSet
