export class ResolvablePromise<T> {
  promise: Promise<T>;
  reject: (reason?: any) => void;
  resolve: (value?: T | PromiseLike<T>) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
