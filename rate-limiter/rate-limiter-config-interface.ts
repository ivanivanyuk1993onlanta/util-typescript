export interface RateLimiterConfigInterface {
  allowedCallCountPerPeriod: number;
  periodInMs: number;
}
