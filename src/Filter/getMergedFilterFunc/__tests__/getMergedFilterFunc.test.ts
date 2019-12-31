// This test is weak, but not very important yet, if method works incorrectly, also add to basic cases good tests which will generate big
// random arrays, apply multiple sequential sorts to them and compare result with merged Comparator result
import { FilterFuncType } from "../../FilterFuncType";
import { getMergedFilterFunc } from "../getMergedFilterFunc";
import { LogicalJoinTypeEnum } from "../../FilterDescription/LogicalJoinTypeEnum";

interface TestInterface {
  a: number;
}

describe("getMergedFilterFunc", () => {
  let array: TestInterface[];
  beforeEach(() => {
    array = [
      {
        a: 10
      },
    ];
  });

  // todo name later
  it("getMergedComparatorFunc-OneFalsy", () => {
    const filterFuncList: FilterFuncType<TestInterface>[] = [v => v.a > 10];
    const logicalJoinTypeList: LogicalJoinTypeEnum[] = [
      LogicalJoinTypeEnum.And
    ];
    const filterFunc = getMergedFilterFunc(filterFuncList, logicalJoinTypeList);
    expect(array.filter(filterFunc)).toEqual([]);
  });

  // todo name later
  it("getMergedComparatorFunc-OneTruthy", () => {
    const filterFuncList: FilterFuncType<TestInterface>[] = [v => v.a > 9];
    const logicalJoinTypeList: LogicalJoinTypeEnum[] = [
      LogicalJoinTypeEnum.And
    ];
    const filterFunc = getMergedFilterFunc(filterFuncList, logicalJoinTypeList);
    expect(array.filter(filterFunc)).toEqual(array);
  });
});
