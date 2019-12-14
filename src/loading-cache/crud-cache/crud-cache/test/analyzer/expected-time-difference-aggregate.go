package analyzer

import (
	"encoding/json"
	"math"
	"testing"
)

func newExpectedTimeDifferenceAggregate() *expectedTimeDifferenceAggregate {
	return &expectedTimeDifferenceAggregate{
		MinDifferenceFromExpected: math.MaxInt64,
	}
}

type expectedTimeDifferenceAggregate struct {
	AverageDifferenceFromExpected int64
	Count                         int64
	DifferenceFromExpectedSum     int64
	MaxDifferenceFromExpected     int64
	MinDifferenceFromExpected     int64
}

func (expectedTimeDifferenceAggregate *expectedTimeDifferenceAggregate) computeAverage() {
	expectedTimeDifferenceAggregate.AverageDifferenceFromExpected = expectedTimeDifferenceAggregate.DifferenceFromExpectedSum / expectedTimeDifferenceAggregate.Count
}

func (expectedTimeDifferenceAggregate *expectedTimeDifferenceAggregate) processTime(
	time int64,
) {
	expectedTimeDifferenceAggregate.Count++
	expectedTimeDifferenceAggregate.DifferenceFromExpectedSum += time

	if time > expectedTimeDifferenceAggregate.MaxDifferenceFromExpected {
		expectedTimeDifferenceAggregate.MaxDifferenceFromExpected = time
	}
	if time < expectedTimeDifferenceAggregate.MinDifferenceFromExpected {
		expectedTimeDifferenceAggregate.MinDifferenceFromExpected = time
	}
}

func (expectedTimeDifferenceAggregate *expectedTimeDifferenceAggregate) testAverage(
	timeToTestAgainst int64,
	timestampName string,
	t *testing.T,
) {
	expectedTimeDifferenceAggregate.computeAverage()
	if expectedTimeDifferenceAggregate.AverageDifferenceFromExpected > timeToTestAgainst {
		jsonBytes, _ := json.Marshal(expectedTimeDifferenceAggregate)
		t.Logf("Implementer create call %s time is not expected", timestampName)
		t.Log(string(jsonBytes))
		t.Fail()
	}
}
