import {ComparatorFuncResultEnum} from './comparator-func-result-enum';

export type ComparatorFuncType<T> = (left, right: T) => ComparatorFuncResultEnum;
