# CRUD cache requirements
1. General notes
   - Deleted records should be accessible with value of nil (hence cache will remember that record was deleted for some time)
   - Cache should have refresh time - time, after which record reload should be initiated
   - Cache should have spoil time - time, after which record value should not be returned before it is refreshed
   - Cache should have timeout - maximum time
   - Record actuality can not be decided in cache - it is responsibility of CRUDImplementer methods (why - because most common use case - read from API or DB, we can not know DB timestamp even if one read was completed before other as request/response transfer time is not constant)
   - Cache should have only one simultaneously active CRUDImplementer.Read/CRUDImplementer.ReadMany per key, if CRUDCache.Read needs to wait for value and it is in progress, only first CRUDCache.Read should init refresh, later ones should subscribe to result
   - Non-timeout errors should be broadcast immediately to result subscribers, they should not waste resources and wait for timeout
   - Timeout errors should return after timeout, even if CRUDImplementer has blocking calls that last longer than timeout
   - Read should init load, even when active updating calls exist (why - because they may finish with errors, but Read is not interested in updating calls' errors), but should stop waiting, if one of updating calls' results updates record
   - Not actual results should not update cache
   - On updating call result, if it is more actual, record should be updated and pushed to subscribers, otherwise ValueUpdatedButNotActualError should be thrown(result should not be returned as it is not actual), Set caller code should decide whether it needs to get latest result or not and whether it needs to know if latest value is equal to stored value or not
1. Cache should have method Clean, which should clean all spoiled records
    - For simplicity, it is allowed to delete spoiled records that have subscribers, as
        - deletion won't affect record requests before deletion(they already got pointer to record, cache will work as if there weren't calls after deletion)
        - checking for subscribers requires additional logic for already complex cache
        - record requests after deletion may have, at worst case, 1 redundant api-read call, which breaks the requirement to have 1 simultaneous api-read call, but I accept it, because this behaviour may occur only during Cleans
1. Cache and CRUDImplementer methods
    1. Create
        - Most common use case - value is passed to CRUDImplementer.Create, then it returns value, actuality timestamp and id, then cache registers record in map
        - Cache
            - Input
                - value
            - Output
                - value
                - error
                - timeout error
            - Side effects
                - updates individual record map
        - Implementer
            - Input
                - value
            - Output
                - value, actuality timestamp, id
                - error
    1. CreateMany
        - Most common use case - value list is passed to CRUDImplementer.CreateMany, then it returns value list, common actuality timestamp, id list, then cache registers record in individual record map, but does not touch record list map
        - Cache
            - Input
                - value list
            - Output
                - value list
                - error
                - timeout error
            - Side effects
                - updates individual record map
        - Implementer
            - Input
                - value list
            - Output
                - value list, actuality timestamp, id list
                - error
    1. Delete
        - Most common use case - we pass id to CRUDImplementer.Delete, it deletes record and returns id and actuality timestamp, then cache updates record in individual record map (updates actuality timestamp and sets value to null)
        - Cache
            - Input
                - id
            - Output
                - error
                - timeout error
            - Side effects
                - updates individual record map
        - Implementer
            - Input
                - id
            - Output
                - actuality timestamp
                - error
    1. DeleteMany
        - Most common use case - we pass id list to CRUDImplementer.DeleteMany, it deletes records and returns id list, common actuality timestamp, then cache updates individual record map
        - Cache
            - Input
                - id list
            - Output
                - error
                - timeout error
            - Side effects
                - updates individual record map
        - Implementer
            - Input
                - id list
            - Output
                - actuality timestamp
                - error
    1. Read
        - Most common use case - we pass id to CRUDImplementer.Read, it builds query for record and timestamp, then returns them
        - Cache
            - Read input
                - id
            - Read output
                - value
                - error
                - timeout error
            - Side effects
                - initializing refresh
                - updating cache record
        - Implementer
            - Input
                - id
            - Output
                - value and actuality timestamp
                - error
        - Notes
            - Only one concurrent read for one key should be active simultaneously
            - Finished with error Read and subscribers should return immediately on error receive
    1. ReadMany
        - Most common use case - we pass prepared sql query string or paramStruct to CRUDImplementer.ReadMany, it returns list of records, common actuality timestamp, and ids (it is it's responsibility to know which field is id field), then cache updates both individual values cache and list values cache
        - Cache
            - Input
                - sqlQueryString or paramStruct
            - Output
                - value list
                - error
                - timeout error
            - Side effects
                - updates individual record map
                - updates record list map
        - Implementer
            - Input
                - sqlQueryString or paramStruct
            - Output
                - value list, id list, actuality timestamp
                - error
        - Notes
            - List record cache should act as normal CRUDCache, but with value of type List<V> and only Read method
    1. Update
        - Most common use case - we pass id and update meta data to CRUDImplementer.Update, it gets from update meta data which fields should be updated, builds query, returns record, actuality timestamp, cache updates individual record map
        - Cache
            - Input
                - id
                - update meta data
            - Output
                - value
                - error
                - timeout error
            - Side effects
                - updates individual record map
        - Implementer
            - Input
                - id
                - update meta data
            - Output
                - value, actuality timestamp
                - error
    1. UpdateMany
        - Most common use case - we pass id list and update meta data list to CRUDImplementer.UpdateMany, it gets from update meta data list which fields should be updated, builds query, returns record list, common actuality timestamp, cache updates individual record map
        - Cache
            - Input
                - id list
                - update meta data list
            - Output
                - value list
                - error
                - timeout error
            - Side effects
                - updates individual record map
        - Implementer
            - Input
                - id list
                - update meta data list
            - Output
                - value list, common actuality timestamp
                - error

# Test suggestions
1. Each record can have thousands of possible states, hence common test cases can not be written without spending too much resources
1. Suggestion
    1. Generate thousands randomized calls in random time during some time period from concurrent goroutines
    1. Write call statistics, including
        - Cache call start time
        - Cache call parameters
        - Cache call finish time
        - Cache call result
        - Implementer call start time
        - Implementer call parameters
        - Implementer call finish time
        - Implementer call result
        - Implementer call random parameters, including
            - Pre-decided random request to db travel time
            - Pre-decided random response to server travel time, which should have chance to exceed timeout to test that function doesn't wait for call if it is longer than timeout
            - Pre-decided random result or random error to return
    1. Write all statistics records to list, sort it by time, analyze each record whether it's existence breaks cache requirements or not
1. What should be tested
    1. Cache call result value/error
    1. Cache call time
    1. That refresh is initialised only on refresh timeout and there is only one actual refresh at a time