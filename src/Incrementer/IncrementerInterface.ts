export interface IncrementerInterface<IncrementType> {
  /**
   * Method implementation should return current value of increment
   */
  get(): IncrementType;
  /**
   * Method implementation should increment and return new value
   */
  incrementAndGet(): IncrementType;
}
