import {ComparatorFuncResultEnum} from '../../class-folder/comparator/comparator-func-result-enum';

export function sortByFuncResult<T, V>(
  list: Array<T>,
  func: (item: T) => V,
) {
  list.sort((left, right) => {
    const leftResult = func(left);
    const rightResult = func(right);

    if (leftResult < rightResult) {
      return ComparatorFuncResultEnum.LeftLess;
    } else if (leftResult > rightResult) {
      return ComparatorFuncResultEnum.LeftGreater;
    } else {
      return ComparatorFuncResultEnum.Equal;
    }
  });
}
