export interface StorageInterface {
  /**
   * Removes all stored values.
   * @returns {Promise<any>}
   */
  clear(): Promise<any>;

  /**
   * Gets a stored item
   * @param reference {string}
   * @returns {Promise<any>}
   */
  getItem(reference: string): Promise<any>;

  /**
   * Retrieving all keys
   * @returns {Promise<any>}
   */
  keys(): Promise<any>;

  /**
   * Removes a single stored item
   * @param reference {string}
   * @returns {Promise<any>}
   */
  remove(reference: string): Promise<any>;

  /**
   * Stores a value
   * @param reference {string}
   * @param value
   * @returns {Promise<any>}
   */
  setItem(reference: string, value: any): Promise<any>;
}
