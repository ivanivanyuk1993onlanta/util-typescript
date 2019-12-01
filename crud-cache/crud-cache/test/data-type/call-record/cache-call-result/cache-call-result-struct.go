package cache_call_result

import (
	test_model "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/test-model"
)

type CacheCreateCallResult struct {
	Error error
	Value test_model.TestModel
}

type CacheDeleteCallResult struct {
	Error error
}

type CacheReadCallResult struct {
	Error error
	Value test_model.TestModel
}

type CacheUpdateCallResult struct {
	Error        error
	UpdatedValue test_model.TestModel
}
