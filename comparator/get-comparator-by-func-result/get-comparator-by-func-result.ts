import {ComparatorFuncType} from '../comparator-func-type';
import {ComparatorFuncResultEnum} from '../comparator-func-result-enum';

export function getComparatorByFuncResult<ItemType, FuncResultType>(
  func: (item: ItemType) => FuncResultType,
): ComparatorFuncType<ItemType> {
  return (left: ItemType, right: ItemType) => {
    const leftFuncResult = func(left);
    const rightFuncResult = func(right);
    if (leftFuncResult < rightFuncResult) {
      return ComparatorFuncResultEnum.LeftLess;
    } else if (leftFuncResult > rightFuncResult) {
      return ComparatorFuncResultEnum.LeftGreater;
    } else {
      return ComparatorFuncResultEnum.Equal;
    }
  };
}
