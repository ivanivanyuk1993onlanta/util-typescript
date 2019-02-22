export class FormFieldBase<T> {
  fieldName: string;
  fieldNumber: number;
  langKey: string;
  order: number;
  value: T;

  constructor(options: {
    fieldName?: string,
    fieldNumber?: number,
    langKey?: string;
    order?: number,
    value?: T,
  } = {}) {
    this.fieldName = options.fieldName || '';
    this.fieldNumber = options.fieldNumber || 0;
    this.langKey = options.langKey || '';
    this.order = options.order === undefined ? 1 : options.order;
    this.value = options.value;
  }
}
