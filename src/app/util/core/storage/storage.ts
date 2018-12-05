import * as localForage from 'localforage';

export class StorageWrap {
  storage: LocalForage;

  constructor(name: string) {
    this.storage = localForage.createInstance({
      name: name,
    });

    return this;
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
