import {ComparatorFuncType} from '../../../class-folder/comparator/comparator-func-type';

export function getReversedComparator<T>(comparator: ComparatorFuncType<T>): ComparatorFuncType<T> {
  return (left: T, right: T) => comparator(left, right) * -1;
}
