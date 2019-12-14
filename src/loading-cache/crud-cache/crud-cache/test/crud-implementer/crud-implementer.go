package crud_implementer

import (
	call_parameter_struct "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-parameter-struct"
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/implementer-call-record"
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/implementer-call-result"
	error2 "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/error"
	test_model "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/test-model"
	crud_cache "github.com/ivanivanyuk1993/util-go/crud-cache/test/generated/github.com/ivanivanyuk1993/util-go/crud-cache/uint64-int64-test_model.TestModel"
	get_current_timestamp "github.com/ivanivanyuk1993/util-go/method/get-current-timestamp"
)

var emptyValue = test_model.TestModel{}

func NewTestCrudImplementer(
	config TestCrudImplementerConfig,
) *TestCrudImplementer {
	map2 := make(map[uint64]*valueWithMutex)
	for i := 0; i < config.MaxRecordCount; i++ {
		map2[uint64(i)] = &valueWithMutex{}
	}
	return &TestCrudImplementer{
		dbImitationMap:       map2,
		maxRecordCount:       config.MaxRecordCount,
		StatisticsRecordChan: make(chan interface{}, config.StatisticsRecordChanSize),
		timeout:              config.Timeout,
	}
}

type TestCrudImplementer struct {
	dbImitationMap       map[uint64]*valueWithMutex
	maxRecordCount       int
	StatisticsRecordChan chan interface{}
	timeout              int64
}

func (testCrudImplementer *TestCrudImplementer) Create(
	value test_model.TestModel,
) (
	crud_cache.CreateResult,
	error,
) {
	startTimestamp := get_current_timestamp.GetCurrentTimestamp()
	callStartRecord := &implementer_call_record.ImplementerCreateCallStartRecord{
		CreateCallParameterStruct: call_parameter_struct.CreateCallParameterStruct{
			Value: value,
		},
		ImplementerCallStartRecord: testCrudImplementer.newImplementerCallStartStatisticsRecord(startTimestamp),
	}
	testCrudImplementer.StatisticsRecordChan <- callStartRecord

	// Imitating request to db travel time
	imitateDataTransfer(callStartRecord.RequestToDbPreDecidedTravelTime)

	id := testCrudImplementer.GetRandomKey()
	callFinishRecord := &implementer_call_record.ImplementerCreateCallFinishRecord{
		ImplementerCreateCallStartRecord: callStartRecord,
	}

	valueWithMutex := testCrudImplementer.dbImitationMap[id]
	actualityTimestamp := get_current_timestamp.GetCurrentTimestamp()

	valueWithMutex.Lock()
	if valueWithMutex.value != emptyValue {
		valueWithMutex.Unlock()
		callFinishRecord.Error = error2.CreateError(actualityTimestamp)
	} else {
		valueCopy := value
		valueCopy.ActualityTimeStamp = actualityTimestamp
		valueCopy.Id = id
		callFinishRecord.CreateResult = crud_cache.CreateResult{
			ActualityTimestamp: actualityTimestamp,
			Key:                id,
			Value:              valueCopy,
		}
		valueWithMutex.value = valueCopy
		valueWithMutex.Unlock()
	}

	// Imitating response to server travel time
	imitateDataTransfer(callStartRecord.ResponseToServerPreDecidedTravelTime)

	// Writing CallFinishTime and statistics record, returning value
	testCrudImplementer.StatisticsRecordChan <- callFinishRecord
	callFinishRecord.Timestamp = get_current_timestamp.GetCurrentTimestamp()

	return callFinishRecord.CreateResult, callFinishRecord.Error
}

func (testCrudImplementer *TestCrudImplementer) Delete(key uint64) (deleteActualityTimestamp int64, error error) {
	startTimestamp := get_current_timestamp.GetCurrentTimestamp()
	callStartRecord := &implementer_call_record.ImplementerDeleteCallStartRecord{
		DeleteCallParameterStruct: call_parameter_struct.DeleteCallParameterStruct{
			Key: key,
		},
		ImplementerCallStartRecord: testCrudImplementer.newImplementerCallStartStatisticsRecord(startTimestamp),
	}
	testCrudImplementer.StatisticsRecordChan <- callStartRecord

	// Imitating request to db travel time
	imitateDataTransfer(callStartRecord.RequestToDbPreDecidedTravelTime)

	callFinishRecord := &implementer_call_record.ImplementerDeleteCallFinishRecord{
		ImplementerDeleteCallStartRecord: callStartRecord,
	}

	valueWithMutex := testCrudImplementer.dbImitationMap[key]
	actualityTimestamp := get_current_timestamp.GetCurrentTimestamp()

	valueWithMutex.Lock()
	if valueWithMutex.value != emptyValue {
		callFinishRecord.ImplementerDeleteCallResult = implementer_call_result.ImplementerDeleteCallResult{
			DeleteActualityTimestamp: actualityTimestamp,
		}
		valueWithMutex.value = emptyValue
		valueWithMutex.Unlock()
	} else {
		valueWithMutex.Unlock()
		callFinishRecord.ImplementerDeleteCallResult = implementer_call_result.ImplementerDeleteCallResult{
			Error: error2.DeleteError(actualityTimestamp),
		}
	}

	// Imitating response to server travel time
	imitateDataTransfer(callStartRecord.ResponseToServerPreDecidedTravelTime)

	testCrudImplementer.StatisticsRecordChan <- callFinishRecord
	callFinishRecord.Timestamp = get_current_timestamp.GetCurrentTimestamp()

	return callFinishRecord.DeleteActualityTimestamp, callFinishRecord.Error
}

func (testCrudImplementer *TestCrudImplementer) Read(key uint64) (crud_cache.ReadResult, error) {
	startTimestamp := get_current_timestamp.GetCurrentTimestamp()
	callStartRecord := &implementer_call_record.ImplementerReadCallStartRecord{
		ImplementerCallStartRecord: testCrudImplementer.newImplementerCallStartStatisticsRecord(startTimestamp),
		ReadCallParameterStruct: call_parameter_struct.ReadCallParameterStruct{
			Key: key,
		},
	}
	testCrudImplementer.StatisticsRecordChan <- callStartRecord

	// Imitating request to db travel time
	imitateDataTransfer(callStartRecord.RequestToDbPreDecidedTravelTime)

	callFinishRecord := &implementer_call_record.ImplementerReadCallFinishRecord{
		ImplementerReadCallStartRecord: callStartRecord,
	}

	valueWithMutex := testCrudImplementer.dbImitationMap[key]
	actualityTimestamp := get_current_timestamp.GetCurrentTimestamp()

	valueWithMutex.Lock()
	if valueWithMutex.value != emptyValue {
		valueCopy := valueWithMutex.value
		valueCopy.ActualityTimeStamp = actualityTimestamp
		callFinishRecord.ImplementerReadCallResult = implementer_call_result.ImplementerReadCallResult{
			ReadResult: crud_cache.ReadResult{
				ActualityTimestamp: actualityTimestamp,
				Value:              valueCopy,
			},
		}
		valueWithMutex.value = valueCopy
		valueWithMutex.Unlock()
	} else {
		valueWithMutex.Unlock()
		callFinishRecord.ImplementerReadCallResult = implementer_call_result.ImplementerReadCallResult{
			Error: error2.ReadError(actualityTimestamp),
		}
	}

	// Imitating response to server travel time
	imitateDataTransfer(callStartRecord.ResponseToServerPreDecidedTravelTime)

	testCrudImplementer.StatisticsRecordChan <- callFinishRecord
	callFinishRecord.Timestamp = get_current_timestamp.GetCurrentTimestamp()

	return callFinishRecord.ReadResult, callFinishRecord.Error
}
func (testCrudImplementer *TestCrudImplementer) Update(key uint64, updateMetaData int64) (crud_cache.ReadResult, error) {
	startTimestamp := get_current_timestamp.GetCurrentTimestamp()
	callStartRecord := &implementer_call_record.ImplementerUpdateCallStartRecord{
		ImplementerCallStartRecord: testCrudImplementer.newImplementerCallStartStatisticsRecord(startTimestamp),
		UpdateCallParameterStruct: call_parameter_struct.UpdateCallParameterStruct{
			Key:            key,
			UpdateMetaData: updateMetaData,
		},
	}
	testCrudImplementer.StatisticsRecordChan <- callStartRecord

	// Imitating request to db travel time
	imitateDataTransfer(callStartRecord.RequestToDbPreDecidedTravelTime)

	callFinishRecord := &implementer_call_record.ImplementerUpdateCallFinishRecord{
		ImplementerUpdateCallStartRecord: callStartRecord,
	}

	valueWithMutex := testCrudImplementer.dbImitationMap[key]
	actualityTimestamp := get_current_timestamp.GetCurrentTimestamp()

	valueWithMutex.Lock()
	if valueWithMutex.value != emptyValue {
		valueCopy := valueWithMutex.value
		valueCopy.ActualityTimeStamp = actualityTimestamp
		valueCopy.UpdateStartTimestamp = updateMetaData
		callFinishRecord.ImplementerUpdateCallResult = implementer_call_result.ImplementerUpdateCallResult{
			ReadResult: crud_cache.ReadResult{
				ActualityTimestamp: actualityTimestamp,
				Value:              valueCopy,
			},
		}
		valueWithMutex.value = valueCopy
		valueWithMutex.Unlock()
	} else {
		valueWithMutex.Unlock()
		callFinishRecord.ImplementerUpdateCallResult = implementer_call_result.ImplementerUpdateCallResult{
			Error: error2.UpdateError(actualityTimestamp),
		}
	}

	// Imitating response to server travel time
	imitateDataTransfer(callStartRecord.ResponseToServerPreDecidedTravelTime)

	testCrudImplementer.StatisticsRecordChan <- callFinishRecord
	callFinishRecord.Timestamp = get_current_timestamp.GetCurrentTimestamp()

	return callFinishRecord.ReadResult, callFinishRecord.Error
}
