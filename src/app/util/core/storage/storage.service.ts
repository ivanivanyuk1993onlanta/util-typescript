import {Injectable} from '@angular/core';
import {StorageInterface} from './storage-interface';
import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root',
})
export class StorageService implements StorageInterface {
  private storage: LocalForage;

  constructor() {
    this.storage = localForage.createInstance({});
  }

  clear(): Promise<void> {
    return this.storage.clear();
  }

  get<T>(key: string): Promise<T> {
    return this.storage.getItem(key);
  }

  remove(key: string): Promise<void> {
    return this.storage.removeItem(key);
  }

  set<T>(key: string, value: T): Promise<T> {
    return this.storage.setItem<T>(key, value);
  }
}
