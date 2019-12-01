package analyzer

import (
	"container/list"
	cache_call_record "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/cache-call-record"
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/implementer-call-record"
	error2 "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/error"
	test_model "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/test-model"
	timeout_error "github.com/ivanivanyuk1993/util-go/error/timeout-error"
	"testing"
)

var emptyValue = test_model.TestModel{}

func AnalyzeCallStatistics(
	callStatisticsList []interface{},
	t *testing.T,
	config Config,
) {
	// This list is required to find ImplementerCreateCallStartRecord initializing CacheCreateCallStartRecord
	cacheCreateCallStartRecordList := list.New()
	// This list is required to find ImplementerCreateCallFinishRecord preceding CacheCreateCallFinishRecord
	implementerCreateCallFinishRecordList := list.New()

	implementerCreateCallActualityExpectedTimeAggregate := newExpectedTimeDifferenceAggregate()
	implementerCreateCallFinishExpectedTimeAggregate := newExpectedTimeDifferenceAggregate()
	implementerCreateCallStartExpectedTimeAggregate := newExpectedTimeDifferenceAggregate()

	for _, statisticsRecordUntyped := range callStatisticsList {
		switch statisticsRecord := statisticsRecordUntyped.(type) {
		case *cache_call_record.CacheCreateCallFinishRecord:
			if isTimedOut := statisticsRecord.Timestamp-statisticsRecord.CacheCreateCallStartRecord.Timestamp >
				config.Timeout+config.AllowedTimeoutDifference; isTimedOut {
				if statisticsRecord.Value != emptyValue {
					t.Log(statisticsRecord.Timestamp - statisticsRecord.CacheCreateCallStartRecord.Timestamp)
					t.Log(config.Timeout)
					t.Log("Value should be empty when timed out")
					t.Log(statisticsRecord.Value)
					t.Log()
					t.Fail()
				}
				if timeoutError, ok := statisticsRecord.Error.(timeout_error.TimeoutError); ok {
					if int64(timeoutError) != config.Timeout {
						t.Log("TimeoutError timeout is not equal to timeout")
						t.Log(timeoutError)
						t.Log(config.Timeout)
						t.Fail()
					}
				} else {
					t.Log(statisticsRecord.Timestamp - statisticsRecord.CacheCreateCallStartRecord.Timestamp)
					t.Log(config.Timeout)
					t.Log("Error should be of type TimeoutError when timed out")
					t.Log(statisticsRecord.Error)
					t.Log()
					t.Fail()
				}
			} else {
				// t.Log(isTimedOut)
			}
			// complementingImplementerCreateCallFinishRecord := popComplementingImplemeterCreateCallFinishRecord(
			// 	implementerCreateCallFinishRecordList,
			// 	statisticsRecord,
			// )
			// statisticsRecord.CacheCreateCallResult.
		case *cache_call_record.CacheCreateCallStartRecord:
			cacheCreateCallStartRecordList.PushBack(statisticsRecord)
		case *implementer_call_record.ImplementerCreateCallFinishRecord:
			implementerCreateCallFinishRecordList.PushBack(statisticsRecord)

			implementerCreateCallFinishExpectedTimeAggregate.processTime(
				statisticsRecord.Timestamp - getImplementerCreateCallExpectedFinishTime(
					statisticsRecord.ImplementerCreateCallStartRecord,
				),
			)

			var actualityTimestamp int64
			if statisticsRecord.Error != nil {
				if createError, ok := statisticsRecord.Error.(error2.CreateError); ok {
					actualityTimestamp = int64(createError)
				} else {
					t.Error("Implementer create error is of wrong type")
				}
			} else {
				actualityTimestamp = statisticsRecord.CreateResult.ActualityTimestamp
				if actualityTimestamp != statisticsRecord.CreateResult.Value.ActualityTimeStamp {
					t.Errorf(
						"Actuality timestamps do not match, %v != %v",
						actualityTimestamp,
						statisticsRecord.CreateResult.Value.ActualityTimeStamp,
					)
				}
				if statisticsRecord.CreateResult.Key != statisticsRecord.CreateResult.Value.Id {
					t.Errorf(
						"Ids do not match, %v != %v",
						statisticsRecord.CreateResult.Key,
						statisticsRecord.CreateResult.Value.Id,
					)
				}
				if statisticsRecord.CreateResult.Value.UpdateStartTimestamp != 0 {
					t.Errorf(
						"New record`s UpdateStartTimestamp should be 0, got %v",
						statisticsRecord.CreateResult.Value.UpdateStartTimestamp,
					)
				}
			}

			implementerCreateCallActualityExpectedTimeAggregate.processTime(
				actualityTimestamp - getImplementerCreateCallExpectedActualityTimestamp(
					statisticsRecord.ImplementerCreateCallStartRecord,
				),
			)
		case *implementer_call_record.ImplementerCreateCallStartRecord:
			complementingCacheCreateCallStartRecord := popComplementingCacheCreateCallStartRecord(
				cacheCreateCallStartRecordList,
				statisticsRecord,
			)
			implementerCreateCallStartExpectedTimeAggregate.processTime(
				statisticsRecord.Timestamp - complementingCacheCreateCallStartRecord.Timestamp,
			)
		default:
			// byteList, _ := json.Marshal(statisticsRecord)
			// t.Log("Unknown record type")
			// t.Log(string(byteList))
			t.Fail()
		}
	}
	t.Fail()

	implementerCreateCallActualityExpectedTimeAggregate.testAverage(
		config.ImplementerCreateCallActualityExpectedTimeAverageThreshold,
		"actuality",
		t,
	)

	implementerCreateCallFinishExpectedTimeAggregate.testAverage(
		config.ImplementerCreateCallFinishExpectedTimeAverageThreshold,
		"finish",
		t,
	)

	implementerCreateCallStartExpectedTimeAggregate.testAverage(
		config.ImplementerCreateCallStartExpectedTimeAverageThreshold,
		"start",
		t,
	)
}

func getImplementerCreateCallExpectedActualityTimestamp(
	record *implementer_call_record.ImplementerCreateCallStartRecord,
) int64 {
	return record.Timestamp + record.RequestToDbPreDecidedTravelTime
}

func getImplementerCreateCallExpectedFinishTime(
	record *implementer_call_record.ImplementerCreateCallStartRecord,
) int64 {
	return getImplementerCreateCallExpectedActualityTimestamp(record) + record.ResponseToServerPreDecidedTravelTime
}

func popComplementingCacheCreateCallStartRecord(
	cacheCreateCallStartRecordList *list.List,
	implementerCreateCallStartRecord *implementer_call_record.ImplementerCreateCallStartRecord,
) (
	cacheCreateCallStartRecord *cache_call_record.CacheCreateCallStartRecord,
) {
	for node := cacheCreateCallStartRecordList.Front(); node != nil; node = node.Next() {
		cacheCreateCallStartRecord = node.Value.(*cache_call_record.CacheCreateCallStartRecord)
		if cacheCreateCallStartRecord.CreateCallParameterStruct == implementerCreateCallStartRecord.CreateCallParameterStruct {
			cacheCreateCallStartRecordList.Remove(node)
			break
		}
	}

	return cacheCreateCallStartRecord
}

func popComplementingImplemeterCreateCallFinishRecord(
	implementerCreateCallFinishRecordList *list.List,
	cacheCreateCallFinishRecord *cache_call_record.CacheCreateCallFinishRecord,
) (
	implementerCreateCallFinishRecord *implementer_call_record.ImplementerCreateCallFinishRecord,
) {
	for node := implementerCreateCallFinishRecordList.Front(); node != nil; node = node.Next() {
		implementerCreateCallFinishRecord = node.Value.(*implementer_call_record.ImplementerCreateCallFinishRecord)
		if cacheCreateCallFinishRecord.Value == implementerCreateCallFinishRecord.CreateResult.Value &&
			cacheCreateCallFinishRecord.Error == implementerCreateCallFinishRecord.Error {
			implementerCreateCallFinishRecordList.Remove(node)
			break
		}
	}

	return implementerCreateCallFinishRecord
}
