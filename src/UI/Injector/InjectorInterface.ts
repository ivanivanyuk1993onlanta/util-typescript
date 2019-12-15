export interface InjectorInterface<TokenIDType> {
  /**
   * Method implementation should return token by ID
   * @param injectionTokenID
   * @throws {RequestedTokenDoesNotExistError}
   */
  get<InjectionInstanceType>(
    injectionTokenID: TokenIDType
  ): InjectionInstanceType;
  /**
   * Method implementation should register token by ID
   * @param injectionTokenID
   * @param injectionInstance
   * @throws {TokenAlreadyExistsError}
   */
  set<InjectionInstanceType>(
    injectionTokenID: TokenIDType,
    injectionInstance: InjectionInstanceType
  ): void;
}
