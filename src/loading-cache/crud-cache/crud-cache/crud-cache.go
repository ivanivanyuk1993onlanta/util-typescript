package crud_cache

import (
	value_updated_but_not_actual_error "github.com/ivanivanyuk1993/util-go/crud-cache/value-updated-but-not-actual-error"
	"github.com/ivanivanyuk1993/util-go/error/timeout-error"
	"github.com/ivanivanyuk1993/util-go/method/get-current-timestamp"
	"sync"
	"time"
)

func NewCrudCache(
	config CrudCacheConfig,
) *CrudCache {
	return &CrudCache{
		crudImplementer: config.CrudImplementer,
		refreshTime:     config.RefreshTime,
		spoilTime:       config.SpoilTime,
		timeout:         config.Timeout,
		timeoutError:    timeout_error.TimeoutError(config.Timeout),
	}
}

type CrudCache struct {
	crudImplementer CrudImplementer
	refreshTime     int64
	spoilTime       int64
	syncMap         sync.Map
	timeout         int64
	timeoutError    timeout_error.TimeoutError
}

func (cache *CrudCache) Clean() {
	// Iterating over map values
	cache.syncMap.Range(func(keyUntyped, recordUntyped interface{}) bool {
		record := recordUntyped.(*crudCacheRecord)
		// Using read-lock, as getOrRegisterCacheRecord is called outside of lock
		// even if our read locks wait for deletion, they already got old record pointer, so there is no reason to wait
		record.valueUpdateRwMutex.RLock()
		// Deleting record from map if it is spoiled
		if get_current_timestamp.GetCurrentTimestamp()-record.actualityTimestamp > cache.spoilTime {
			record.valueUpdateRwMutex.RUnlock()
			cache.syncMap.Delete(keyUntyped)
		} else {
			record.valueUpdateRwMutex.RUnlock()
		}
		return true
	})
}

func (cache *CrudCache) Create(
	value __ValueType__,
) (
	createdValue __ValueType__,
	error2 error,
) {
	// Start timeoutTimer to handle timeout error
	timeoutTimer := time.NewTimer(time.Duration(cache.timeout))

	valueChan := make(chan __ValueType__)
	errorChan := make(chan error)

	go func() {
		createResult, implementerError := cache.crudImplementer.Create(value)
		// it is correct to write timestamp immediately after create complete
		createCompleteTimestamp := get_current_timestamp.GetCurrentTimestamp()
		if implementerError != nil {
			// trying to send error to errorChan (if we can not, it means timeout came earlier and nothing listens on this channel)
			select {
			case errorChan <- implementerError:
			default:
			}
		} else {
			cacheRecord := cache.getOrRegisterCacheRecord(createResult.Key)
			cacheRecord.valueUpdateRwMutex.Lock()
			if createResult.ActualityTimestamp > cacheRecord.actualityTimestamp {
				cacheRecord.updateValue(createResult.ActualityTimestamp, createCompleteTimestamp, createResult.Value)
				cacheRecord.valueUpdateRwMutex.Unlock()

				// trying to send value to valueChan (if we can not, it means timeout came earlier and nothing listens on this channel)
				select {
				case valueChan <- createResult.Value:
				default:
				}
			} else {
				cacheRecord.valueUpdateRwMutex.Unlock()
				// as create did not return error, value was created, but since value is not actual(everything happens!), error should be thrown
				// we do not care here if value changed since it was updated or not, or if we need to return updated value, it is responsibility of create caller code
				// trying to send error to errorChan (if we can not, it means timeout came earlier and nothing listens on this channel)
				select {
				case errorChan <- value_updated_but_not_actual_error.ValueUpdatedButNotActualError{}:
				default:
				}
			}
		}
	}()

	// listening for first error, value, or timeout
	select {
	case error2 = <-errorChan:
		timeoutTimer.Stop()
		return createdValue, error2
	case createdValue = <-valueChan:
		timeoutTimer.Stop()
		return createdValue, nil
	case <-timeoutTimer.C:
		return createdValue, cache.timeoutError
	}
}

func (cache *CrudCache) Delete(
	key __KeyType__,
) (
	error2 error,
) {
	// Start timeoutTimer to handle timeout error
	timeoutTimer := time.NewTimer(time.Duration(cache.timeout))

	errorChan := make(chan error)

	go func() {
		deleteActualityTimestamp, error2 := cache.crudImplementer.Delete(key)
		// it is correct to write timestamp immediately after delete complete
		deleteCompleteTimestamp := get_current_timestamp.GetCurrentTimestamp()
		if error2 != nil {
			// trying to send error to errorChan (if we can not, it means timeout came earlier and nothing listens on this channel)
			select {
			case errorChan <- error2:
			default:
			}
		} else {
			cacheRecord := cache.getOrRegisterCacheRecord(key)
			cacheRecord.valueUpdateRwMutex.Lock()
			if deleteActualityTimestamp > cacheRecord.actualityTimestamp {
				var emptyValue __ValueType__
				cacheRecord.updateValue(deleteActualityTimestamp, deleteCompleteTimestamp, emptyValue)
				cacheRecord.valueUpdateRwMutex.Unlock()

				// trying to send nil error to errorChan (if we can not, it means timeout came earlier and nothing listens on this channel)
				select {
				case errorChan <- nil:
				default:
				}
			} else {
				cacheRecord.valueUpdateRwMutex.Unlock()
				// as delete did not return error, value was deleted, but since value is not actual(everything happens!), error should be thrown
				// we do not care here if value changed since it was updated or not, or if we need to return updated value, it is responsibility of delete caller code
				// trying to send error to errorChan (if we can not, it means timeout came earlier and nothing listens on this channel)
				select {
				case errorChan <- value_updated_but_not_actual_error.ValueUpdatedButNotActualError{}:
				default:
				}
			}
		}
	}()

	// listening for first error(nil error here means success) or timeout
	select {
	case error2 = <-errorChan:
		timeoutTimer.Stop()
		return error2
	case <-timeoutTimer.C:
		return cache.timeoutError
	}
}

func (cache *CrudCache) Read(
	key __KeyType__,
) (
	value __ValueType__,
	error error,
) {
	// Write timestamp to check cacheRecord and error actuality against
	readStartTimestamp := get_current_timestamp.GetCurrentTimestamp()
	// Start timeoutTimer to handle timeout error
	timeoutTimer := time.NewTimer(time.Duration(cache.timeout))

	cacheRecord := cache.getOrRegisterCacheRecord(key)

	// Locking mutex because we are about to read variables that can be updated concurrently
	cacheRecord.valueUpdateRwMutex.RLock()
	timePassedSinceActualityTimestamp := readStartTimestamp - cacheRecord.actualityTimestamp
	// check if refresh should be initiated
	if timePassedSinceActualityTimestamp > cache.refreshTime {
		// We are about to read and update, depending on read result, lastApiReadStartTimestamp, hence we lock mutex
		cacheRecord.apiReadStartMutex.Lock()
		if cache.isLastApiReadFinished(cacheRecord, readStartTimestamp) {
			cacheRecord.lastApiReadStartTimestamp = readStartTimestamp
			// we unlock mutex both when we init refresh and not, but we do not need to hold lock after we set lastApiReadStartTimestamp
			// hence we duplicate unlock in both if and else and not after if-else block
			cacheRecord.apiReadStartMutex.Unlock()
			go cache.initApiRead(key, cacheRecord, readStartTimestamp)
		} else {
			// we unlock mutex both when we init refresh and not, but we do not need to hold lock after we set lastApiReadStartTimestamp
			// hence we duplicate unlock in both if and else and not after if-else block
			cacheRecord.apiReadStartMutex.Unlock()
		}
	}

	// check if should wait for load completion
	if timePassedSinceActualityTimestamp > cache.spoilTime {
		// Not forgetting to unlock mutex
		cacheRecord.valueUpdateRwMutex.RUnlock()
		select {
		case <-timeoutTimer.C:
			return value, cache.timeoutError
		case error = <-cacheRecord.readErrorChan:
			// Not forgetting to stop timer
			timeoutTimer.Stop()
			return value, error
		case value = <-cacheRecord.valueChan:
			// Not forgetting to stop timer
			timeoutTimer.Stop()
			return value, nil
		}
	} else {
		// we do not unlock record after return, instead we copy value, then unlock record, then return copied value
		value = cacheRecord.value
		// Not forgetting to unlock mutex
		cacheRecord.valueUpdateRwMutex.RUnlock()
		// Not forgetting to stop timer
		timeoutTimer.Stop()
		return value, nil
	}
}

func (cache *CrudCache) Update(
	key __KeyType__,
	updateMetaData __UpdateMetaDataType__,
) (
	updatedValue __ValueType__,
	error2 error,
) {
	// Start timeoutTimer to handle timeout error
	timeoutTimer := time.NewTimer(time.Duration(cache.timeout))

	valueChan := make(chan __ValueType__)
	errorChan := make(chan error)

	go func() {
		updateResult, implementerError := cache.crudImplementer.Update(key, updateMetaData)
		// it is correct to write timestamp immediately after update complete
		updateCompleteTimestamp := get_current_timestamp.GetCurrentTimestamp()
		if implementerError != nil {
			// trying to send error to errorChan (if we can not, it means timeout came earlier and nothing listens on this channel)
			select {
			case errorChan <- implementerError:
			default:
			}
		} else {
			cacheRecord := cache.getOrRegisterCacheRecord(key)
			cacheRecord.valueUpdateRwMutex.Lock()
			if updateResult.ActualityTimestamp > cacheRecord.actualityTimestamp {
				cacheRecord.updateValue(updateResult.ActualityTimestamp, updateCompleteTimestamp, updateResult.Value)
				cacheRecord.valueUpdateRwMutex.Unlock()

				// trying to send value to valueChan (if we can not, it means timeout came earlier and nothing listens on this channel)
				select {
				case valueChan <- updateResult.Value:
				default:
				}
			} else {
				cacheRecord.valueUpdateRwMutex.Unlock()
				// as update did not return error, value was updated, but since value is not actual(everything happens!), error should be thrown
				// we do not care here if value changed since it was updated or not, or if we need to return updated value, it is responsibility of outer code
				// trying to send error to errorChan (if we can not, it means timeout came earlier and nothing listens on this channel)
				select {
				case errorChan <- value_updated_but_not_actual_error.ValueUpdatedButNotActualError{}:
				default:
				}
			}
		}
	}()

	// listening for first error, value, or timeout
	select {
	case error2 = <-errorChan:
		timeoutTimer.Stop()
		return updatedValue, error2
	case updatedValue = <-valueChan:
		timeoutTimer.Stop()
		return updatedValue, nil
	case <-timeoutTimer.C:
		return updatedValue, cache.timeoutError
	}
}

func (cache *CrudCache) getOrRegisterCacheRecord(
	key __KeyType__,
) (
	cacheRecord *crudCacheRecord,
) {
	var cacheRecordUntyped interface{}
	var isLoaded bool
	// Try Load without LoadOrStore and newCrudCacheRecord overhead
	if cacheRecordUntyped, isLoaded = cache.syncMap.Load(key); !isLoaded {
		// Load did not return value, have to go LoadOrStore and newCrudCacheRecord overhead way
		cacheRecordUntyped, _ = cache.syncMap.LoadOrStore(key, newCrudCacheRecord())
	}
	return cacheRecordUntyped.(*crudCacheRecord)
}

func (cache *CrudCache) initApiRead(
	key __KeyType__,
	cacheRecord *crudCacheRecord,
	readStartTimestamp int64,
) {
	// Writing Load result
	readResult, error2 := cache.crudImplementer.Read(key)
	// it is correct to take timestamp right after CrudImplementer.Read is complete
	apiReadCompleteTimestamp := get_current_timestamp.GetCurrentTimestamp()
	// Handling CrudImplementer.Read that resulted in error
	if error2 != nil {
		// write-locking mutex since we are about to update record
		cacheRecord.valueUpdateRwMutex.Lock()
		// we should only broadcast error to subscribers if it is actual
		if cache.isApiReadActual(cacheRecord, readStartTimestamp, apiReadCompleteTimestamp) {
			cacheRecord.lastActualApiReadErrorOrValueUpdateTimestamp = apiReadCompleteTimestamp
			// sending error while there are subscribers to error channel
		ErrorBroadcastLoop:
			for {
				select {
				case cacheRecord.readErrorChan <- error2:
				default:
					break ErrorBroadcastLoop
				}
			}
		}
	} else {
		// write-locking mutex since we are about to update record
		cacheRecord.valueUpdateRwMutex.Lock()
		// we should update value to new only if new value is more actual
		if readResult.ActualityTimestamp > cacheRecord.actualityTimestamp {
			cacheRecord.updateValue(readResult.ActualityTimestamp, apiReadCompleteTimestamp, readResult.Value)
		}
	}
	cacheRecord.valueUpdateRwMutex.Unlock()
}

func (cache *CrudCache) isApiReadActual(
	record *crudCacheRecord,
	readStartTimestamp int64,
	apiReadCompleteTimestamp int64,
) bool {
	return readStartTimestamp == record.lastApiReadStartTimestamp && // apiRead is latest
		readStartTimestamp >= record.lastActualApiReadErrorOrValueUpdateTimestamp && // apiRead is not interrupted by error or update from store
		apiReadCompleteTimestamp-readStartTimestamp <= cache.timeout // apiRead is not timed out
}

func (cache *CrudCache) isLastApiReadFinished(
	record *crudCacheRecord,
	readStartTimestamp int64,
) bool {
	return record.lastApiReadStartTimestamp < record.lastActualApiReadErrorOrValueUpdateTimestamp || // there was api-read error or record update after lastApiReadStartTimestamp
		readStartTimestamp-record.lastApiReadStartTimestamp > cache.timeout // time passed since lastApiReadStartTimestamp is greater than timeout
}
