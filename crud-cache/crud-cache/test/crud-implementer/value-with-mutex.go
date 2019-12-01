package crud_implementer

import (
	test_model "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/test-model"
	"sync"
)

type valueWithMutex struct {
	sync.Mutex
	value test_model.TestModel
}
