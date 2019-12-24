// todo add tests and helpful comments

import { FilterFuncType } from "../FilterFuncType";

export function getMergedFilterFunc<ValueType>(
  filterFuncList: FilterFuncType<ValueType>[]
): FilterFuncType<ValueType> {
  return (value: ValueType): boolean =>
    filterFuncList.every(filterFunc => filterFunc(value));
}
