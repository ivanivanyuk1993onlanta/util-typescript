export class FormFieldBase<T> {
  key: string;
  order: number;
  value: T;

  constructor(options: {
    key?: string,
    order?: number,
    value?: T,
  } = {}) {
    this.key = options.key || '';
    this.order = options.order === undefined ? 1 : options.order;
    this.value = options.value;
  }
}
