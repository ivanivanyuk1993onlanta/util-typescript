import {Observable} from 'rxjs';
import {ILoadResult} from './i-load-result';

export interface ILoadingCacheLoader<K, V> {
  load$(key: K): Observable<ILoadResult<V>>;
  store$(key: K, value: V): Observable<ILoadResult<V>>;
}
