import * as localForage from 'localforage';

export class StorageWrap {
  private _storage: LocalForage;

  constructor(name: string) {
    this._storage = localForage.createInstance({
      name: name,
    });

    return this;
  }

  clear(): Promise<void> {
    return this._storage.clear();
  }

  get<T>(key: string): Promise<T> {
    return this._storage.getItem(key);
  }

  remove(key: string): Promise<void> {
    return this._storage.removeItem(key);
  }

  set<T>(key: string, value: T): Promise<T> {
    return this._storage.setItem<T>(key, value);
  }
}
