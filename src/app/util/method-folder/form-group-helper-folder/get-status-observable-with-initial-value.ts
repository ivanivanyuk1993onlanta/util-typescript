import {AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';

export function getStatusObservableWithInitialValue(
  formControl: AbstractControl,
): Observable<string> {
  return formControl.statusChanges.pipe(
    startWith(formControl.status),
  );
}
