// Simple tests are to test randomized

import { NumberTokenInjector } from "../NumberTokenInjector";
import { RequestedTokenDoesNotExistError } from "../../RequestedTokenDoesNotExistError";
import { TokenAlreadyExistsError } from "../../TokenAlreadyExistsError";

describe("NumberTokenInjector", () => {
  it("NumberTokenInjector", () => {
    const incrementer = new NumberTokenInjector();

    expect(incrementer.get.bind(incrementer, 1)).toThrow(
      RequestedTokenDoesNotExistError
    );

    incrementer.set(1, "123");
    expect(incrementer.set.bind(incrementer, 1, "123")).toThrow(
      TokenAlreadyExistsError
    );
    expect(incrementer.get(1)).toBe("123");
    expect(incrementer.get(1)).toBe("123");

    incrementer.set(2, 2);
    expect(incrementer.set.bind(incrementer, 2, 2)).toThrow(
      TokenAlreadyExistsError
    );
    expect(incrementer.get(2)).toBe(2);
    expect(incrementer.get(2)).toBe(2);

    expect(incrementer.get(1)).toBe("123");
    expect(incrementer.get(1)).toBe("123");
    expect(incrementer.get(2)).toBe(2);
    expect(incrementer.get(2)).toBe(2);
  });
});
