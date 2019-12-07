import {ComparatorFuncType} from '../comparator-func-type';

// Todo add why this func is needed or remove it if it is not

export function getReversedComparator<T>(comparator: ComparatorFuncType<T>): ComparatorFuncType<T> {
  return (left: T, right: T) => comparator(left, right) * -1;
}
