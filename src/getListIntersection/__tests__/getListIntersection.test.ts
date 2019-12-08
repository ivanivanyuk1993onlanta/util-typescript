import { getListIntersection } from '../getListIntersection';

describe("getListIntersection", () => {
  it("getListIntersection", () => {
    expect(getListIntersection([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
    expect(getListIntersection([1, 2, 3], [1, 2])).toEqual([1, 2]);
    expect(getListIntersection([1, 2, 3], [1])).toEqual([1]);
    expect(getListIntersection([1, 2], [])).toEqual([]);
    expect(getListIntersection([], [1, 2])).toEqual([]);
  });
});
