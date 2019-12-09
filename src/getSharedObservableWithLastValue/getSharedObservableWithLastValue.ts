import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

// Метод возвращает observable, который не порождает поток при подписке, а использует существующий, который при этом
// даёт последнее значение опоздавшим подписчикам

// Method returns observable that is not resubscribed, but shared among subscribers, which also sends last value to late
// subscribers
export function getSharedObservableWithLastValue<ValueType>(
  observable$: Observable<ValueType>
): Observable<ValueType> {
  return observable$.pipe(shareReplay(1));
}
