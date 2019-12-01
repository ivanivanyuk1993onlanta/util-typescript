package crud_cache

import (
	"sync"
)

func newCrudCacheRecord() (newLoadingCacheRecord *crudCacheRecord) {
	return &crudCacheRecord{}
}

type crudCacheRecord struct {
	actualityTimestamp                           int64              // used to check ReadResult actuality
	apiReadStartMutex                            sync.Mutex         // used to lock access to lastApiReadStartTimestamp
	lastActualApiReadErrorOrValueUpdateTimestamp int64              // used to check if refresh should be initiated
	lastApiReadStartTimestamp                    int64              // used to check if refresh should be initiated
	readErrorChan                                chan error         // when record is not fresh enough, Read listens for CrudImplementer.Read errors on this channel
	value                                        __ValueType__      // used to store last value
	valueChan                                    chan __ValueType__ // when record is not fresh enough, Read listens for CrudImplementer.Read results on this channel
	valueUpdateRwMutex                           sync.RWMutex       // used to lock record
}

func (record *crudCacheRecord) updateValue(
	actualityTimestamp int64,
	lastActualApiReadErrorOrValueUpdateTimestamp int64,
	value __ValueType__,
) {
	record.actualityTimestamp = actualityTimestamp
	record.lastActualApiReadErrorOrValueUpdateTimestamp = lastActualApiReadErrorOrValueUpdateTimestamp
	record.value = value
ValueBroadcastLoop:
	for {
		select {
		case record.valueChan <- value:
		default:
			break ValueBroadcastLoop
		}
	}
}
