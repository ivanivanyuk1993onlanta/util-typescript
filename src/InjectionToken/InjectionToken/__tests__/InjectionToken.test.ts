// Simple tests are to test randomized tests
import { InjectionToken } from "../InjectionToken";
import { InjectionTokenIsNotSetError } from "../../InjectionTokenIsNotSetError";
import { InjectionTokenIsAlreadySetError } from "../../InjectionTokenIsAlreadySetError";

describe("InjectionToken", () => {
  interface TestInterface {
    a: number;
  }

  it("InjectionToken", () => {
    const testInjectionToken = new InjectionToken<TestInterface>();

    expect(() => {
      return testInjectionToken.get();
    }).toThrowError(InjectionTokenIsNotSetError);
    expect(() => {
      return testInjectionToken.get();
    }).toThrowError(InjectionTokenIsNotSetError);

    const injection = {
      a: 1
    };

    testInjectionToken.set(injection);

    expect(testInjectionToken.get().a).toBe(1);
    expect(testInjectionToken.get().a).toBe(1);

    injection.a = 2;

    expect(testInjectionToken.get().a).toBe(2);
    expect(testInjectionToken.get().a).toBe(2);

    expect(() => {
      testInjectionToken.set(injection);
    }).toThrowError(InjectionTokenIsAlreadySetError);
    expect(() => {
      testInjectionToken.set(injection);
    }).toThrowError(InjectionTokenIsAlreadySetError);

    expect(testInjectionToken.get().a).toBe(2);
    expect(testInjectionToken.get().a).toBe(2);
  });
});
