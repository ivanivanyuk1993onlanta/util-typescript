// This test is weak, but not very important yet, if method works incorrectly, also add to basic cases good tests which will generate big
// random arrays, apply multiple sequential sorts to them and compare result with merged Comparator result
import { getMergedFilterFunc } from "../getMergedFilterFunc";
import { LogicalJoinTypeEnum } from "../../FilterDescription/LogicalJoinTypeEnum";
import { getRandomIntFromInterval } from "../../../getRandomIntFromInterval/getRandomIntFromInterval";

describe("getMergedFilterFunc", () => {
  it("getMergedComparatorFuncRandomized", () => {
    const funcCount = 4;
    const numberCount = 1e4;

    const logicalJoinTypeList = [...Array(funcCount)].map(() =>
      getRandomIntFromInterval(0, 1)
        ? LogicalJoinTypeEnum.And
        : LogicalJoinTypeEnum.Or
    );

    let evalFilterString = "";

    const filterList = [...Array(funcCount)].map((_, index) => {
      let comparedNumber: number;
      const isOperatorGreater = Boolean(getRandomIntFromInterval(0, 1));
      if (isOperatorGreater) {
        comparedNumber = getRandomIntFromInterval(10, 20);
        if (index) {
          evalFilterString += `${
            logicalJoinTypeList[index] === LogicalJoinTypeEnum.And ? "&&" : "||"
          } value > ${comparedNumber}`;
        } else {
          evalFilterString += `value > ${comparedNumber}`;
        }
      } else {
        comparedNumber = getRandomIntFromInterval(30, 40);
        if (index) {
          evalFilterString += `${
            logicalJoinTypeList[index] === LogicalJoinTypeEnum.And ? "&&" : "||"
          } value < ${comparedNumber}`;
        } else {
          evalFilterString += `value < ${comparedNumber}`;
        }
      }

      return isOperatorGreater
        ? (value: number) => value > comparedNumber
        : (value: number) => value < comparedNumber;
    });

    const mergedFilter = getMergedFilterFunc(filterList, logicalJoinTypeList);

    const testFilter = (value: number) => eval(evalFilterString);

    const valueList = [...Array(numberCount)].map(() =>
      getRandomIntFromInterval(0, 50)
    );

    const filterTime = performance.now();
    const filteredList = valueList.filter(mergedFilter);
    const filterTime2 = performance.now();

    const filterTime3 = performance.now();
    const testList = valueList.filter(testFilter);
    const filterTime4 = performance.now();

    expect(filteredList).toEqual(testList);
    expect(filterTime2 - filterTime).toBeLessThan(filterTime4 - filterTime3);
  });
});
