import {map, startWith} from 'rxjs/operators';
import {StorageWrap} from './storage';

export class RegisterFieldObserversMixin {
  private _storage: StorageWrap;

  private _registerFieldObservers<T>(
    fieldName: string,
    getValueDefaultFunc: () => Promise<T>,
  ): void {
    const fieldNameFormControl = `_${fieldName}FormControl`;
    const fieldNameObservable = `${fieldName}$`;

    this[fieldNameObservable] = this[fieldNameFormControl].valueChanges.pipe(
      startWith(this[fieldNameFormControl].value),
      map((value) => {
        return value;
      }),
    );

    this[fieldNameFormControl].valueChanges.subscribe(
      (value: T) => {
        this._storage.set<T>(fieldName, value);
      },
    );

    this._storage.get<T>(fieldName).
      then((valueStored: T) => {
        if (valueStored !== null) {
          this[fieldNameFormControl].setValue(valueStored);
        } else {
          getValueDefaultFunc().then(
            (value: T) => {
              this[fieldNameFormControl].setValue(value);
            },
          );
        }
      }).
      catch(() => {
        getValueDefaultFunc().
          then((value: T) => {
            this[fieldNameFormControl].setValue(value);
          });
      });
  }
}
