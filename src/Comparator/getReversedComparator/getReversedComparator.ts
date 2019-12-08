import { ComparatorFuncType } from "../ComparatorFuncType";
import { ComparatorFuncResultEnum } from '../ComparatorFuncResultEnum';

// Todo add why this func is needed or remove it if it is not

export function getReversedComparator<ValueType>(
  comparator: ComparatorFuncType<ValueType>
): ComparatorFuncType<ValueType> {
  return (left: ValueType, right: ValueType): ComparatorFuncResultEnum => comparator(left, right) * -1;
}
