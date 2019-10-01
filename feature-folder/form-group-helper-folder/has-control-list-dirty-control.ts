import {AbstractControl} from '@angular/forms';

export function hasControlListDirtyControl(
  controlList: Array<AbstractControl>,
): boolean {
  for (const control of controlList) {
    if (control.dirty) {
      return true;
    }
  }
  return false;
}
