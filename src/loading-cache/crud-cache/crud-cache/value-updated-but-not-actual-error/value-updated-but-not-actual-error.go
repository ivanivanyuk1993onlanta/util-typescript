package value_updated_but_not_actual_error

type ValueUpdatedButNotActualError struct{}

func (err ValueUpdatedButNotActualError) Error() string {
	return "ValueUpdatedButNotActual"
}
