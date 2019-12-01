package error

import (
	"fmt"
)

type CreateError int64

func (e CreateError) Error() string {
	return fmt.Sprintf("create:%v", int64(e))
}

type DeleteError int64

func (e DeleteError) Error() string {
	return fmt.Sprintf("delete:%v", e)
}

type ReadError int64

func (e ReadError) Error() string {
	return fmt.Sprintf("read:%v", e)
}

type UpdateError int64

func (e UpdateError) Error() string {
	return fmt.Sprintf("update:%v", e)
}
