import { ComparatorFuncType } from "../ComparatorFuncType";
import { ComparatorFuncResultEnum } from "../ComparatorFuncResultEnum";

// todo add readme

export function getComparatorByFuncResult<ItemType, FuncResultType>(
  func: (item: ItemType) => FuncResultType
): ComparatorFuncType<ItemType> {
  return (left: ItemType, right: ItemType): ComparatorFuncResultEnum => {
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
