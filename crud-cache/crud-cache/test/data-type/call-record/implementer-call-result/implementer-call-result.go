package implementer_call_result

import (
	crud_cache "github.com/ivanivanyuk1993/util-go/crud-cache/test/generated/github.com/ivanivanyuk1993/util-go/crud-cache/uint64-int64-test_model.TestModel"
)

type ImplementerCreateCallResult struct {
	CreateResult crud_cache.CreateResult
	Error        error
}

type ImplementerDeleteCallResult struct {
	DeleteActualityTimestamp int64
	Error                    error
}

type ImplementerReadCallResult struct {
	ReadResult crud_cache.ReadResult
	Error      error
}

type ImplementerUpdateCallResult struct {
	ReadResult crud_cache.ReadResult
	Error      error
}
