package crud_implementer

import (
	"github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/implementer-call-record"
	timestamp_container "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/call-record/timestamp-container"
	"math/rand"
	"time"
)

func (testCrudImplementer *TestCrudImplementer) GetRandomKey() uint64 {
	return uint64(rand.Intn(testCrudImplementer.maxRecordCount))
}

func (testCrudImplementer *TestCrudImplementer) newImplementerCallStartStatisticsRecord(
	timestamp int64,
) implementer_call_record.ImplementerCallStartRecord {
	return implementer_call_record.ImplementerCallStartRecord{
		RequestToDbPreDecidedTravelTime:      rand.Int63n(testCrudImplementer.timeout),
		ResponseToServerPreDecidedTravelTime: rand.Int63n(testCrudImplementer.timeout),
		TimestampContainer:                   timestamp_container.TimestampContainer{Timestamp: timestamp},
	}
}

func imitateDataTransfer(travelTime int64) {
	time.Sleep(time.Duration(travelTime))
}
