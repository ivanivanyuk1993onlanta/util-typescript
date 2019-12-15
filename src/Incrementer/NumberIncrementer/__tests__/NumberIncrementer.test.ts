// Simple tests are to test randomized
import { NumberIncrementer } from "../NumberIncrementer";

describe("NumberIncrementer", () => {
  it("NumberIncrementer", () => {
    const incrementer = new NumberIncrementer();

    expect(incrementer.get()).toBe(0);
    expect(incrementer.get()).toBe(0);
    expect(incrementer.incrementAndGet()).toBe(1);
    expect(incrementer.get()).toBe(1);
    expect(incrementer.get()).toBe(1);
    expect(incrementer.incrementAndGet()).toBe(2);
    expect(incrementer.incrementAndGet()).toBe(3);
    expect(incrementer.get()).toBe(3);
  });
});
