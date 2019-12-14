package analyzer

type Config struct {
	AllowedTimeoutDifference                                   int64
	ImplementerCreateCallActualityExpectedTimeAverageThreshold int64
	ImplementerCreateCallFinishExpectedTimeAverageThreshold    int64
	ImplementerCreateCallStartExpectedTimeAverageThreshold     int64
	Timeout                                                    int64
}
