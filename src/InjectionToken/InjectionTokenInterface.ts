/**
 * Interface implementation should be used like this
 * 1) You export const SomeTypeInjectionToken = InjectionToken<SomeInterface> from your library
 * 2) You import this InjectionToken inside your library
 * 3) You import library from package manager
 * 4) You import token from your code, which is outside your library and call set, before You use anything
 */
export interface InjectionTokenInterface<InjectionType> {
  /**
   * Should return InjectionType
   * @throws {InjectionTokenIsNotSetError}
   */
  get(): InjectionType;

  /**
   * Should initialize InjectionType with value
   * @throws {InjectionTokenIsAlreadySetError}
   */
  set(injection: InjectionType): void;
}
