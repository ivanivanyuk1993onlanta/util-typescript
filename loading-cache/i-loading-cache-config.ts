import {ILoadingCacheLoader} from './i-loading-cache-loader';

export interface ILoadingCacheConfig<K, V> {
  cacheLoader: ILoadingCacheLoader<K, V>;
  refreshTime: number;
  spoilTime: number;
  timeout: number;
}
