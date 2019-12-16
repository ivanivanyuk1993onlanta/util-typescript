export interface PersistentStorageInterface {
  /**
   * Method implementation should delete key and resolve when operation is
   * complete
   * @param key
   */
  deleteAsync<KeyType>(key: KeyType): Promise<void>;

  /**
   * Method implementation should get key and resolve with value when operation
   * is complete
   * @param key
   */
  getAsync<KeyType, ValueType>(key: KeyType): Promise<ValueType | undefined>;

  /**
   * Method implementation should set value by key and resolve with void when
   * operation is complete
   * @param key
   * @param value
   */
  setAsync<KeyType, ValueType>(key: KeyType, value: ValueType): Promise<void>;
}
