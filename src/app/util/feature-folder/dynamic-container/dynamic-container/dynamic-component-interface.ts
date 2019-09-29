import {OnChanges} from '@angular/core';
// Todo make input BehaviorSubject, do not extend OnChanges, which will help
//  to not care about change detection/OnChanges call/unnecessary in some cases interface, only next call
export interface DynamicComponentInterface<InputType> extends OnChanges {
  input: InputType;
}
