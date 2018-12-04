import {Injectable} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage';
import {StorageInterface} from './storage-interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService implements StorageInterface {
  constructor(private nativeStorage: NativeStorage) {
  }

  /**
   * Removes all stored values.
   * @returns {Promise<any>}
   */
  clear(): Promise<any> {
    return this.nativeStorage.clear();
  }

  /**
   * Gets a stored item
   * @param reference {string}
   * @returns {Promise<any>}
   */
  getItem(reference: string): Promise<any> {
    return this.nativeStorage.getItem(reference);
  }

  /**
   * Retrieving all keys
   * @returns {Promise<any>}
   */
  keys(): Promise<any> {
    return this.nativeStorage.keys();
  }

  /**
   * Removes a single stored item
   * @param reference {string}
   * @returns {Promise<any>}
   */
  remove(reference: string): Promise<any> {
    return this.nativeStorage.remove(reference);
  }

  /**
   * Stores a value
   * @param reference {string}
   * @param value
   * @returns {Promise<any>}
   */
  setItem(reference: string, value: any): Promise<any> {
    return this.nativeStorage.setItem(reference, value);
  }
}
