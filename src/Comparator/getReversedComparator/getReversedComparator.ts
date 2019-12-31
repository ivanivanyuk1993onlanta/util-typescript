import { ComparatorFuncType } from "../ComparatorFuncType";
import { ComparatorFuncResultEnum } from "../ComparatorFuncResultEnum";

// todo write tests
// todo Write to readme that this func is definitely needed to implement client table sort
// Todo add why this func is needed or remove it if it is not

export function getReversedComparator<ValueType>(
  comparator: ComparatorFuncType<ValueType>
): ComparatorFuncType<ValueType> {
  return (left: ValueType, right: ValueType): ComparatorFuncResultEnum =>
    comparator(left, right) * -1;
}
