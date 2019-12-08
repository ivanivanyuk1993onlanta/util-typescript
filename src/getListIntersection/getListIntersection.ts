export function getListIntersection<ItemType>(
  listA: ItemType[],
  listB: ItemType[]
): ItemType[] {
  let longerList: ItemType[];
  let shorterList: ItemType[];
  if (listA.length < listB.length) {
    longerList = listB;
    shorterList = listA;
  } else {
    longerList = listA;
    shorterList = listB;
  }

  // Straight forward comparison time < set building time
  // x * y < x + y
  // x * y - x - y < 0
  // f'x = y - 1
  // f'y = x - 1
  // x = 1 or y = 1 are Critical Points, derivatives change sign from - to + in 1,
  // hence solution is 1
  // If shorter list consists of 1 element or less, we can skip set building
  if (shorterList.length <= 1) {
    return shorterList.filter(item => longerList.indexOf(item) !== -1);
  } else {
    // Here we could
    // 1) build 2 sets for n=shorterLength + n=longerLength, then have n=shorterLength
    // Set.has calls
    // 2) build set for n=longerLength, then have n=shorterLength Set.has calls
    // 3) build set for n=shorterLength, then have n=longerLength Set.has calls
    // We chose 3, because Set building is more expensive than Set.has
    const shorterSet = new Set(shorterList);
    return longerList.filter(item => shorterSet.has(item));
  }
}
