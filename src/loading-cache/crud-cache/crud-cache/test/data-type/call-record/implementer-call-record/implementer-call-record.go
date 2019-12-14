package implementer_call_record

import (
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-parameter-struct"
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/implementer-call-result"
	timestamp_container "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/timestamp-container"
)

type ImplementerCallStartRecord struct {
	RequestToDbPreDecidedTravelTime      int64
	ResponseToServerPreDecidedTravelTime int64
	timestamp_container.TimestampContainer
}

type ImplementerCreateCallFinishRecord struct {
	implementer_call_result.ImplementerCreateCallResult
	ImplementerCreateCallStartRecord *ImplementerCreateCallStartRecord
	timestamp_container.TimestampContainer
}

type ImplementerCreateCallStartRecord struct {
	call_parameter_struct.CreateCallParameterStruct
	ImplementerCallStartRecord
}

type ImplementerDeleteCallFinishRecord struct {
	implementer_call_result.ImplementerDeleteCallResult
	ImplementerDeleteCallStartRecord *ImplementerDeleteCallStartRecord
	timestamp_container.TimestampContainer
}

type ImplementerDeleteCallStartRecord struct {
	call_parameter_struct.DeleteCallParameterStruct
	ImplementerCallStartRecord
}

type ImplementerReadCallFinishRecord struct {
	implementer_call_result.ImplementerReadCallResult
	ImplementerReadCallStartRecord *ImplementerReadCallStartRecord
	timestamp_container.TimestampContainer
}

type ImplementerReadCallStartRecord struct {
	call_parameter_struct.ReadCallParameterStruct
	ImplementerCallStartRecord
}

type ImplementerUpdateCallFinishRecord struct {
	implementer_call_result.ImplementerUpdateCallResult
	ImplementerUpdateCallStartRecord *ImplementerUpdateCallStartRecord
	timestamp_container.TimestampContainer
}

type ImplementerUpdateCallStartRecord struct {
	call_parameter_struct.UpdateCallParameterStruct
	ImplementerCallStartRecord
}
