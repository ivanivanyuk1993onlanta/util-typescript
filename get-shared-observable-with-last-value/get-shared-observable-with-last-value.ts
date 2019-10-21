import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

// Метод возвращает observable, который не порождает поток при подписке, а использует существующий, который при этом
// даёт последнее значение опоздавшим подписчикам

// Method returns observable that is not resubscribed, but shared among subscribers, which also sends value to late
// subscribers
export function getSharedObservableWithLastValue<T>(
  observable$: Observable<T>,
): Observable<T> {
  return observable$.pipe(
    shareReplay(1),
  );
}
