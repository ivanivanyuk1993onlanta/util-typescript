export interface ILoadingCacheRecord<V> {
  error: Error;
  isLoading: boolean;
  value: V;
  valueTimestamp: number;
}
