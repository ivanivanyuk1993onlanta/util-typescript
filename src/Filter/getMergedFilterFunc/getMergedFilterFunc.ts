// todo add tests and helpful comments

import { FilterFuncType } from "../FilterFuncType";
import { LogicalJoinTypeEnum } from "../FilterDescription/LogicalJoinTypeEnum";

/**
 * We merge filters according to logical operator precedence order. Notice that we want to get very effective filters,
 * hence we are ready to sacrifice performance on filter build step to get most effective filters, which will be applied
 * to all items in collection
 * @param filterFuncList
 * @param logicalJoinTypeList
 */
export function getMergedFilterFunc<ValueType>(
  filterFuncList: FilterFuncType<ValueType>[],
  logicalJoinTypeList: LogicalJoinTypeEnum[]
): FilterFuncType<ValueType> {
  if (filterFuncList.length === 0) {
    return () => true;
  } else if (filterFuncList.length === 1) {
    return filterFuncList[0];
  } else {
    const andFilterGroupList = [[filterFuncList[0]]];
    // splitting to groups of operators to get groups of functions, where false for one means false for all in group
    for (let i = 1; i < filterFuncList.length; i++) {
      if (logicalJoinTypeList[i] !== LogicalJoinTypeEnum.And) {
        andFilterGroupList.push([filterFuncList[i]]);
      } else {
        andFilterGroupList[andFilterGroupList.length - 1].push(
          filterFuncList[i]
        );
      }
    }

    // On this step we have filter lists of functions, joined by And operator. We can safely assume that if any filter
    // of list returns false, whole group returns false, hence we merge lists according to this knowledge
    const mergedFilterList: FilterFuncType<
      ValueType
    >[] = andFilterGroupList.map(filterList => {
      if (filterList.length !== 1) {
        return (value: ValueType): boolean => {
          for (const filter of filterList) {
            if (!filter(value)) {
              return false;
            }
          }
          return true;
        };
      } else {
        return filterList[0];
      }
    });

    // On this step we have list of functions, joined by Or operator. We can safely assume that if any filter
    // of list returns true, whole group returns true, hence we merge lists according to this knowledge
    return mergedFilterList.length !== 1
      ? (value: ValueType): boolean => {
          for (const filter of mergedFilterList) {
            if (filter(value)) {
              return true;
            }
          }
          return false;
        }
      : mergedFilterList[0];
  }
}
