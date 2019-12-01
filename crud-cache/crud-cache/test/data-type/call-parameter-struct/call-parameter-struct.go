package call_parameter_struct

import (
	test_model "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/test-model"
)

type CreateCallParameterStruct struct {
	Value test_model.TestModel
}

type DeleteCallParameterStruct struct {
	Key uint64
}

type ReadCallParameterStruct struct {
	Key uint64
}

type UpdateCallParameterStruct struct {
	Key            uint64
	UpdateMetaData int64
}
