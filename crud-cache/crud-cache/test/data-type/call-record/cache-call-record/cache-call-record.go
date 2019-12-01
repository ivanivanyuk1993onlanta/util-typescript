package cache_call_record

import (
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-parameter-struct"
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/cache-call-result"
	timestamp_container "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/timestamp-container"
)

type CacheCreateCallFinishRecord struct {
	cache_call_result.CacheCreateCallResult
	CacheCreateCallStartRecord *CacheCreateCallStartRecord
	timestamp_container.TimestampContainer
}

type CacheCreateCallStartRecord struct {
	call_parameter_struct.CreateCallParameterStruct
	timestamp_container.TimestampContainer
}

type CacheDeleteCallFinishRecord struct {
	cache_call_result.CacheDeleteCallResult
	CacheDeleteCallStartRecord *CacheDeleteCallStartRecord
	timestamp_container.TimestampContainer
}

type CacheDeleteCallStartRecord struct {
	call_parameter_struct.DeleteCallParameterStruct
	timestamp_container.TimestampContainer
}

type CacheReadCallFinishRecord struct {
	cache_call_result.CacheReadCallResult
	CacheReadCallStartRecord *CacheReadCallStartRecord
	timestamp_container.TimestampContainer
}

type CacheReadCallStartRecord struct {
	call_parameter_struct.ReadCallParameterStruct
	timestamp_container.TimestampContainer
}

type CacheUpdateCallFinishRecord struct {
	cache_call_result.CacheUpdateCallResult
	CacheUpdateCallStartRecord *CacheUpdateCallStartRecord
	timestamp_container.TimestampContainer
}

type CacheUpdateCallStartRecord struct {
	call_parameter_struct.UpdateCallParameterStruct
	timestamp_container.TimestampContainer
}
