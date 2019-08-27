import {OnChanges} from '@angular/core';

export interface DynamicComponentInterface<InputType> extends OnChanges {
  input: InputType;
}
