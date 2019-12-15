import { InjectionTokenInterface } from "../InjectionTokenInterface";
import { InjectionTokenIsNotSetError } from "../InjectionTokenIsNotSetError";
import { InjectionTokenIsAlreadySetError } from "../InjectionTokenIsAlreadySetError";

export class InjectionToken<InjectionType>
  implements InjectionTokenInterface<InjectionType> {
  private _value?: InjectionType;

  get(): InjectionType {
    if (this._value) {
      return this._value;
    } else {
      throw new InjectionTokenIsNotSetError();
    }
  }

  set(injection: InjectionType): void {
    if (this._value) {
      throw new InjectionTokenIsAlreadySetError();
    } else {
      this._value = injection;
    }
  }
}
