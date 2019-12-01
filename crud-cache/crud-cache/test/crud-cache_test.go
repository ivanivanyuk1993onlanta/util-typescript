// todo move analyzer to distinct package, write statistics to file as json, analyze it with analyzer,
//  make folder for other language outer statistics json to skip writing analyzer in other languages
package test

import (
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/analyzer"
	crud_implementer "github.com/ivanivanyuk1993/util-go/crud-cache/test/crud-implementer"
	call_parameter_struct "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-parameter-struct"
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/cache-call-record"
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/cache-call-result"
	test_model "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/test-model"
	crud_cache "github.com/ivanivanyuk1993/util-go/crud-cache/test/generated/github.com/ivanivanyuk1993/util-go/crud-cache/uint64-int64-test_model.TestModel"
	get_current_timestamp "github.com/ivanivanyuk1993/util-go/method/get-current-timestamp"
	"math/rand"
	"runtime"
	"sync"
	"testing"
	"time"
)

var (
	createChance = 19
	deleteChance = 1
	readChance   = 60
	updateChance = 20
)

var (
	createRandomNumber = createChance
	deleteRandomNumber = createChance + deleteChance
	readRandomNumber   = deleteRandomNumber + readChance
	updateRandomNumber = readRandomNumber + updateChance
)

var (
	callsPerGoroutine int   = 1e4
	goMaxProcs              = runtime.GOMAXPROCS(0) / 2
	maxRecordCount          = goMaxProcs
	refreshTime       int64 = 2.5e5 // 0.25 ms
	spoilTime         int64 = 5e5   // 0.5 ms
	timeout           int64 = 1e6   // 1 ms
)

var (
	allowedTimeoutDifference                                   int64 = 150e3
	implementerCreateCallActualityExpectedTimeAverageThreshold int64 = 110e3
	implementerCreateCallFinishExpectedTimeAverageThreshold    int64 = 200e3
	implementerCreateCallStartExpectedTimeAverageThreshold     int64 = 20e3
)

func TestCrudCache(t *testing.T) {
	crudImplementer := crud_implementer.NewTestCrudImplementer(crud_implementer.TestCrudImplementerConfig{
		MaxRecordCount:           maxRecordCount,
		StatisticsRecordChanSize: callsPerGoroutine * goMaxProcs * 4,
		Timeout:                  timeout,
	})
	cache := crud_cache.NewCrudCache(crud_cache.CrudCacheConfig{
		CrudImplementer: crudImplementer,
		RefreshTime:     refreshTime,
		SpoilTime:       spoilTime,
		Timeout:         timeout,
	})
	callStatisticsChan := generateCallStatistics(cache, crudImplementer)
	analyzer.AnalyzeCallStatistics(callStatisticsChan, t, analyzer.Config{
		AllowedTimeoutDifference:                                   allowedTimeoutDifference,
		ImplementerCreateCallActualityExpectedTimeAverageThreshold: implementerCreateCallActualityExpectedTimeAverageThreshold,
		ImplementerCreateCallFinishExpectedTimeAverageThreshold:    implementerCreateCallFinishExpectedTimeAverageThreshold,
		ImplementerCreateCallStartExpectedTimeAverageThreshold:     implementerCreateCallStartExpectedTimeAverageThreshold,
		Timeout: timeout,
	})
}

func generateCallStatistics(
	cache *crud_cache.CrudCache,
	crudImplementer *crud_implementer.TestCrudImplementer,
) []interface{} {
	var waitGroup sync.WaitGroup
	waitGroup.Add(goMaxProcs)
	for goroutineIndex := 0; goroutineIndex < goMaxProcs; goroutineIndex++ {
		go func() {
			for callIndex := 0; callIndex < callsPerGoroutine; callIndex++ {
				randomNumber := rand.Intn(updateRandomNumber)
				if randomNumber < createRandomNumber {
					// create case
					callStartRecord := &cache_call_record.CacheCreateCallStartRecord{
						CreateCallParameterStruct: call_parameter_struct.CreateCallParameterStruct{
							Value: test_model.TestModel{},
						},
					}
					crudImplementer.StatisticsRecordChan <- callStartRecord

					startTimestamp := get_current_timestamp.GetCurrentTimestamp()
					value, err := cache.Create(callStartRecord.Value)
					finishTimestamp := get_current_timestamp.GetCurrentTimestamp()

					callFinishRecord := &cache_call_record.CacheCreateCallFinishRecord{
						CacheCreateCallResult: cache_call_result.CacheCreateCallResult{
							Error: err,
							Value: value,
						},
						CacheCreateCallStartRecord: callStartRecord,
					}
					crudImplementer.StatisticsRecordChan <- callFinishRecord

					callStartRecord.Timestamp = startTimestamp
					callFinishRecord.Timestamp = finishTimestamp
				} else if randomNumber < deleteRandomNumber {
					// delete case
					callStartRecord := &cache_call_record.CacheDeleteCallStartRecord{
						DeleteCallParameterStruct: call_parameter_struct.DeleteCallParameterStruct{
							Key: crudImplementer.GetRandomKey(),
						},
					}
					crudImplementer.StatisticsRecordChan <- callStartRecord

					startTimestamp := get_current_timestamp.GetCurrentTimestamp()
					err := cache.Delete(callStartRecord.Key)
					finishTimestamp := get_current_timestamp.GetCurrentTimestamp()

					callFinishRecord := &cache_call_record.CacheDeleteCallFinishRecord{
						CacheDeleteCallResult: cache_call_result.CacheDeleteCallResult{
							Error: err,
						},
						CacheDeleteCallStartRecord: callStartRecord,
					}
					crudImplementer.StatisticsRecordChan <- callFinishRecord

					callStartRecord.Timestamp = startTimestamp
					callFinishRecord.Timestamp = finishTimestamp
				} else if randomNumber < readRandomNumber {
					// read case
					callStartRecord := &cache_call_record.CacheReadCallStartRecord{
						ReadCallParameterStruct: call_parameter_struct.ReadCallParameterStruct{
							Key: crudImplementer.GetRandomKey(),
						},
					}
					crudImplementer.StatisticsRecordChan <- callStartRecord

					startTimestamp := get_current_timestamp.GetCurrentTimestamp()
					value, err := cache.Read(callStartRecord.Key)
					finishTimestamp := get_current_timestamp.GetCurrentTimestamp()

					callFinishRecord := &cache_call_record.CacheReadCallFinishRecord{
						CacheReadCallResult: cache_call_result.CacheReadCallResult{
							Error: err,
							Value: value,
						},
						CacheReadCallStartRecord: callStartRecord,
					}
					crudImplementer.StatisticsRecordChan <- callFinishRecord

					callStartRecord.Timestamp = startTimestamp
					callFinishRecord.Timestamp = finishTimestamp
				} else {
					// update case
					callStartRecord := &cache_call_record.CacheUpdateCallStartRecord{
						UpdateCallParameterStruct: call_parameter_struct.UpdateCallParameterStruct{
							Key:            crudImplementer.GetRandomKey(),
							UpdateMetaData: get_current_timestamp.GetCurrentTimestamp(),
						},
					}
					crudImplementer.StatisticsRecordChan <- callStartRecord

					startTimestamp := get_current_timestamp.GetCurrentTimestamp()
					value, err := cache.Update(callStartRecord.Key, callStartRecord.UpdateMetaData)
					finishTimestamp := get_current_timestamp.GetCurrentTimestamp()

					callFinishRecord := &cache_call_record.CacheUpdateCallFinishRecord{
						CacheUpdateCallResult: cache_call_result.CacheUpdateCallResult{
							Error:        err,
							UpdatedValue: value,
						},
						CacheUpdateCallStartRecord: callStartRecord,
					}
					crudImplementer.StatisticsRecordChan <- callFinishRecord

					callStartRecord.Timestamp = startTimestamp
					callFinishRecord.Timestamp = finishTimestamp
				}
			}
			waitGroup.Done()
		}()
	}
	waitGroup.Wait()
	// sleeping to wait for timed out implementer calls
	time.Sleep(time.Duration(timeout * 2))

	var list []interface{}
Loop:
	for {
		select {
		case record := <-crudImplementer.StatisticsRecordChan:
			list = append(list, record)
		default:
			break Loop
		}
	}
	return list
}
