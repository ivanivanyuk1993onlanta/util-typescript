import { IncrementerInterface } from "../IncrementerInterface";

export class NumberIncrementer implements IncrementerInterface<number> {
  private currentValue = 0;

  get(): number {
    return this.currentValue;
  }

  incrementAndGet(): number {
    return ++this.currentValue;
  }
}
