export class ResolvablePromise<T> {
  promise: Promise<T>;
  reject: (value?: T | PromiseLike<T>) => void;
  resolve: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
