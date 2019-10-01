import {ComparatorFuncType} from '../comparator-func-type';
import {ComparatorFuncResultEnum} from '../comparator-func-result-enum';

// Todo benchmark solution that doesn't require loop (go from last to first, adding func call to result func(that will effectively remove iterator.next(), but will add func call instead (which may or may not be inlined)))

// What this method helps to achieve, compared with multiple sorts by different criterion:
// 1) Easier to use (more important comparators go from left(first), which is intuitive, instead of applying more important sort last to
// beat other sort results)
// 2) Less important comparators are applied lazily, only if more important returned neutrality, which is effective
// 3) n*log(n)*m (m - number of criteria) is still the same

// comparator func list should be sorted by importance from left to right
export function getMergedComparatorFunc<T>(comparatorFuncList: Array<ComparatorFuncType<T>>): ComparatorFuncType<T> {
  return (left: T, right: T) => {
    // setting initial value in case we got empty array
    let comparatorFuncResult = ComparatorFuncResultEnum.Equal;
    for (const comparatorFunc of comparatorFuncList) {
      comparatorFuncResult = comparatorFunc(left, right);
      // Because comparatorFuncList is sorted by importance, if more important comparator returns non-neutral result, we can stop cycle and
      // return comparator result
      if (comparatorFuncResult !== ComparatorFuncResultEnum.Equal) {
        return comparatorFuncResult;
      }
    }
    // we got here only if we have empty comparatorFuncList or all comparators returned ComparatorFuncResultEnum.Equal
    return comparatorFuncResult;
  };
}
