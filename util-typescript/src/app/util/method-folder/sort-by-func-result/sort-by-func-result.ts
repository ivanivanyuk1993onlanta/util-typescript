export function sortByFuncResult<T, V>(
  list: Array<T>,
  func: (item: T) => V,
) {
  list.sort((left, right) => {
    const leftResult = func(left);
    const rightResult = func(right);

    if (leftResult < rightResult) {
      return -1;
    } else if (leftResult > rightResult) {
      return 1;
    } else {
      return 0;
    }
  });
}
