import { InjectorInterface } from "../InjectorInterface";
import { RequestedTokenDoesNotExistError } from "../RequestedTokenDoesNotExistError";
import { TokenAlreadyExistsError } from "../TokenAlreadyExistsError";

type InjectionTokenType = number;

export class NumberTokenInjector
  implements InjectorInterface<InjectionTokenType> {
  private injectionTokenIDToInstanceMap = new Map<
    InjectionTokenType,
    unknown
  >();

  get<InjectionInstanceType>(
    injectionTokenID: InjectionTokenType
  ): InjectionInstanceType {
    if (!this.injectionTokenIDToInstanceMap.has(injectionTokenID)) {
      throw new RequestedTokenDoesNotExistError();
    }
    return this.injectionTokenIDToInstanceMap.get(
      injectionTokenID
    ) as InjectionInstanceType;
  }

  set<InjectionInstanceType>(
    injectionTokenID: InjectionTokenType,
    injectionInstance: InjectionInstanceType
  ): void {
    if (this.injectionTokenIDToInstanceMap.has(injectionTokenID)) {
      throw new TokenAlreadyExistsError();
    }
    this.injectionTokenIDToInstanceMap.set(injectionTokenID, injectionInstance);
  }
}
