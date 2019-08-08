import {AbstractControl, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';

export function getControlObservableWithInitialValue$<T>(
  formControl: FormControl | AbstractControl,
): Observable<T> {
  return formControl.valueChanges.pipe(
    startWith(formControl.value),
  );
}
