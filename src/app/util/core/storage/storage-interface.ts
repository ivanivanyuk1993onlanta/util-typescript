export interface StorageInterface {
  clear(): Promise<void>;

  get<T>(key: string): Promise<T>;

  remove(key: string): Promise<void>;

  set<T>(key: string, value: T): Promise<T>;
}
