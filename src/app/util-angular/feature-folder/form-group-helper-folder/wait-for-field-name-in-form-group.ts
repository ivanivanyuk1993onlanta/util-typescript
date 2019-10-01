import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {filter, first} from 'rxjs/operators';
import {getControlObservableWithInitialValue} from './get-control-observable-with-initial-value';

export function waitForFieldNameInFormGroup$<ValueType>(
  formGroup: FormGroup,
  fieldName: string,
): Observable<ValueType> {
  return getControlObservableWithInitialValue<ValueType>(formGroup).pipe(
    filter(formValue => fieldName in formValue),
    first(),
  );
}

export function waitForFieldNameListInFormGroup$<T>(
  formGroup: FormGroup,
  fieldNameList: Array<string>,
): Observable<T> {
  return getControlObservableWithInitialValue<T>(formGroup).pipe(
    filter(formValue => {
      // Возвращаем false, если хотя бы одно поле не в форме, что не даст значению пойти дальше по pipe
      for (const fieldName of fieldNameList) {
        if (!(fieldName in formValue)) {
          return false;
        }
      }
      return true;
    }),
    first(),
  );
}
