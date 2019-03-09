import { StorageWrap } from "./storage";
import { BehaviorSubject } from "rxjs";

export function registerStorageObserver<T>(
  storage: StorageWrap,
  subject$: BehaviorSubject<T>,
  storageKey: string,
): Promise<void> {
    return storage.
      get<T>(storageKey).
      then((valueStored: T) => {
        if (valueStored !== null) {
          subject$.next(valueStored);
        }
      }).
      then(() => {
        subject$.subscribe((valueNew: T) => {
          storage.set<T>(storageKey, valueNew);
        })
      });
}